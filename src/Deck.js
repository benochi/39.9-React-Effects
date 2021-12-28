import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import axios from "axios";

const API_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
  const [deck, setDeck] = useState(null);
  const [draw, setDraw] = useState([]);
  //add state to track seconds and auto draw cards. 
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  //API call to load deck http://deckofcardsapi.com/api/deck/new/shuffle/
  useEffect(() => {
    async function getData() {
      let res = await axios.get(`${API_URL}/new/shuffle/`) 
      setDeck(res.data); //we get back success, deck_id, shuffled, remaining
    }
    getData(); //call function to properly execute here
  }, [setDeck]) //will re-render if setDeck is modified. 

  //draw cards
  useEffect(() => {
    //draw a card and add it to useState array -> draw
    async function drawCard(){
      let { deck_id } = deck;
      
      //api call for draw based off deck_id count is optional
      //http://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
      try {
        let drawRes = await axios.get(`${API_URL}/${deck_id}/draw/`)

        //handle out of cards, turn off auto draw and alert “Error: no cards remaining!”
        if(drawRes.data.remaining ===0){
          setAutoDraw(false);
          alert("“Error: no cards remaining!”");
        }
        //if res.data.remaining > 0 pass a card
        const card = drawRes.data.cards[0];

        //map setDraw to include the card object and its data.
        setDraw(d => [...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image
          }
        ]);
        //catch err 
      } catch(err){
        alert(err);
      }
    }
    //draw a card every second by calling drawCard() function if autodraw is true
    if(autoDraw && !timerRef.current) {
      timerRef.current = setInterval(
        async () => {
          await drawCard();
        }, 1000)
    }
    //clear interval to stop memory leakage
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]); //rerender elements. 

  //add autoDraw toggle 
  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  };

  //pass props to Card.js to populate the object. 
  const cards = draw.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-draw" onClick={toggleAutoDraw}>
          {autoDraw ? "Stop" : "Start"} drawing.
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;