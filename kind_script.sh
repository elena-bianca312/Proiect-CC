#!/bin/bash

# Iterate over all YAML files in the current folder
for file in *.yaml; do
  # Check if the file contains "deployment" or "service"
  if grep -E "(kind:\s*Deployment|kind:\s*Service)" "$file" > /dev/null; then
    echo "Applying $file..."
    kubectl apply -f "$file"
  else
    echo "Skipping $file (not a Deployment or Service)"
  fi
done
