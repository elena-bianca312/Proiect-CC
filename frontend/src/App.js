import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [letters, setLetters] = useState([]);
  const [newLetter, setNewLetter] = useState({ name: "", country: "", content: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/");
      const data = await response.json();
      setLetters(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewLetter({
      ...newLetter,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddLetter = async () => {
    const { name, country, content } = newLetter;

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          country: country,
          content: content,
        }),
      });

      if (response.ok) {
        // Successful POST request
        const data = await response.json();
        setMessage(data.message);
        setNewLetter({ name: "", country: "", content: "" });
        fetchData(); // Refresh the letters after adding a new one
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Error adding letter:", errorData.error);
        setMessage("Failed to add letter");
      }
    } catch (error) {
      console.error("Error adding letter:", error);
      setMessage("Failed to add letter");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>Letters for Santa</h2>
          <ul>
            {letters.map((letter) => (
              <li key={letter.id}>
                {letter.name} ({letter.country}): {letter.content}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label>
            Name:
            <input type="text" name="name" value={newLetter.name} onChange={handleInputChange} />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={newLetter.country} onChange={handleInputChange} />
          </label>
          <label>
            Content:
            <input type="text" name="content" value={newLetter.content} onChange={handleInputChange} />
          </label>
          <button onClick={handleAddLetter}>Add Letter</button>
        </div>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
