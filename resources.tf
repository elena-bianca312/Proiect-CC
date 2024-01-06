provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_manifest" "persistentvolume_mysql_pv_volume" {
  manifest = {
    "apiVersion" = "v1"
    "kind"       = "PersistentVolume"
    "metadata" = {
      "labels" = {
        "type" = "local"
      }
      "name" = "mysql-pv-volume"
    }
    "spec" = {
      "accessModes" = [
        "ReadWriteOnce",
      ]
      "capacity" = {
        "storage" = "2Gi"
      }
      "hostPath" = {
        "path" = "/mnt/data"
      }
      "storageClassName" = "manual"
    }
  }
}

resource "kubernetes_manifest" "persistentvolumeclaim_mysql_pv_claim" {
  manifest = {
    "apiVersion" = "v1"
    "kind"       = "PersistentVolumeClaim"
    "metadata" = {
      "name"      = "mysql-pv-claim"
      "namespace" = "default"
    }
    "spec" = {
      "accessModes" = [
        "ReadWriteOnce",
      ]
      "resources" = {
        "requests" = {
          "storage" = "2Gi"
        }
      }
      "storageClassName" = "manual"
    }
  }
}

resource "kubernetes_manifest" "deployment_mysql" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind"       = "Deployment"
    "metadata" = {
      "name"      = "mysql"
      "namespace" = "default"
    }
    "spec" = {
      "selector" = {
        "matchLabels" = {
          "app" = "mysql"
        }
      }
      "strategy" = {
        "type" = "Recreate"
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "app" = "mysql"
          }
        }
        "spec" = {
          "containers" = [
            {
              "env" = [
                {
                  "name"  = "MYSQL_ROOT_PASSWORD"
                  "value" = "test1234"
                },
              ]
              "image" = "mysql:latest"
              "name"  = "mysql"
              "ports" = [
                {
                  "containerPort" = 3306
                  "name"          = "mysql"
                },
              ]
              "volumeMounts" = [
                {
                  "mountPath" = "/var/lib/mysql"
                  "name"      = "mysql-persistent-storage"
                },
              ]
            },
          ]
          "volumes" = [
            {
              "name" = "mysql-persistent-storage"
              "persistentVolumeClaim" = {
                "claimName" = "mysql-pv-claim"
              }
            },
          ]
        }
      }
    }
  }
}


resource "kubernetes_manifest" "service_mysql" {
  manifest = {
    "apiVersion" = "v1"
    "kind"       = "Service"
    "metadata" = {
      "name"      = "mysql"
      "namespace" = "default"
    }
    "spec" = {
      "ports" = [
        {
          "nodePort"   = 30306
          "port"       = 3306
          "targetPort" = 3306
        },
      ]
      "selector" = {
        "app" = "mysql"
      }
      "type" = "NodePort"
    }
  }
}

resource "kubernetes_manifest" "deployment_back_node" {

  depends_on = [
    kubernetes_manifest.deployment_mysql,
    kubernetes_manifest.service_mysql
  ]

  manifest = {
    "apiVersion" = "apps/v1"
    "kind"       = "Deployment"
    "metadata" = {
      "name"      = "back-node"
      "namespace" = "default"
    }
    "spec" = {
      "replicas" = 1
      "selector" = {
        "matchLabels" = {
          "app" = "back-node"
        }
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "app" = "back-node"
          }
        }
        "spec" = {
          "containers" = [
            {
              "env" = [
                {
                  "name"  = "MYSQL_ROOT_PASSWORD"
                  "value" = "test1234"
                },
                {
                  "name"  = "MYSQL_DATABASE"
                  "value" = "pweb"
                },
                {
                  "name"  = "MYSQL_TCP_PORT"
                  "value" = "3306"
                },
              ]
              "image"           = "andrei1505/cc-back-node:latest"
              "imagePullPolicy" = "Always"
              "name"            = "back-node"
              "ports" = [
                {
                  "containerPort" = 3007
                  "name"          = "back-node"
                },
              ]
            },
          ]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "service_back_node" {
  manifest = {
    "apiVersion" = "v1"
    "kind"       = "Service"
    "metadata" = {
      "name"      = "back-node"
      "namespace" = "default"
    }
    "spec" = {
      "ports" = [
        {
          "name"       = "back-node"
          "port"       = 3007
          "protocol"   = "TCP"
          "targetPort" = 3007
        },
      ]
      "selector" = {
        "app" = "back-node"
      }
      "type" = "NodePort"
    }
  }
}

resource "kubernetes_manifest" "pod_kong" {
  manifest = {
    "apiVersion" = "v1"
    "kind"       = "Pod"
    "metadata" = {
      "name"      = "kong"
      "namespace" = "default"

    }
    "spec" = {
      "containers" = [
        {
          "env" = [
            {
              "name"  = "KONG_DATABASE"
              "value" = "off"
            },
            {
              "name"  = "KONG_DECLARATIVE_CONFIG_STRING"
              "value" = "{\"_format_version\":\"1.1\", \"services\":[{\"name\":\"back-node\",\"url\":\"http://back-node:3007/appointment\",\"port\":3007,\"protocol\":\"http\", \"routes\":[{\"paths\":[\"/appointment\"]}]}],\"plugins\":[{\"name\":\"cors\", \"config\":{\"origins\":[\"*\"]}}]}"
            },
            {
              "name"  = "KONG_PROXY_ACCESS_LOG"
              "value" = "/dev/stdout"
            },
            {
              "name"  = "KONG_ADMIN_ACCESS_LOG"
              "value" = "/dev/stdout"
            },
            {
              "name"  = "KONG_PROXY_ERROR_LOG"
              "value" = "/dev/stderr"
            },
            {
              "name"  = "KONG_ADMIN_ERROR_LOG"
              "value" = "/dev/stderr"
            },
            {
              "name"  = "KONG_ADMIN_LISTEN"
              "value" = "0.0.0.0:8001, 0.0.0.0:8444 ssl"
            },
          ]
          "image" = "kong:latest"
          "name"  = "kong"
          "ports" = [
            {
              "containerPort" = 8000
              "name"          = "http"
            },
          ]
        },
      ]
    }
  }
}