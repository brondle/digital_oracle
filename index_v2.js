const Sentiment = require('sentiment');
const exec = require('child_process').exec;
const psList = require('ps-list');
const fs = require('fs');

let sentiment = new Sentiment();

// get card json file generated by charRNN
let data = JSON.parse(fs.readFileSync('./cards/rnn_cards.json'), 'json');
let sentimentTotal = 0;
//get all the cards
//initialize empty array for 3 cards
let drawnCards = [];
//draw 3 random cards
for(i = 0; i <= 2; i++) {
  drawnCards.push(data[Math.floor(Math.random()*data.length)]);
}
//display cards in terminal, perform sentiment analysis on card description
drawnCards.map((card, index) => {
  console.log(`Card ${index} is the ${card.title}, ${card.desc}`);
  let analysis = sentiment.analyze(card.desc);
  console.log(`The sentiment rating for this card is ${analysis.score}`);
  sentimentTotal += analysis.score;
});
//get average of sentiment score for the 3 cards
let sentScore = sentimentTotal/3;

//get running processes, then act on result of the reading
psList().then(result => {
  console.log('sentscore: ', sentScore);
  //if score is over 3, start an inactive process
  if (sentScore >= 3) {
    let inactives = result.filter(i => {
      if (i.cpu === 0 && i.memory === 0) {
        return i;
      }
    });
    let rand = inactives[Math.floor(Math.random() * inactives.length)];
    console.log('cherishing: ', rand);
    exec(`${ rand.cmd }`, (e, out, err) => {
     if (e !== null) {
       console.log('e: ', e);
     } else {
       console.log('stdout: ' + out);
       console.log('stderr: ' + err);
     }
 })

  }
  //if score is below 1.5, kill an active process
  if (sentScore < 1.5) {
    let actives = result.filter(i => {
      if (i.cpu > 0 || i.memory > 0) {
        return i;
      }
    });

    let rand = actives[Math.floor(Math.random() * actives.length)];
    console.log('killing: ', rand);
    exec(`kill ${ rand.pid }`, (e, out, err) => {
     if (e !== null) {
       console.log('e: ', e);
     } else {
       console.log('stdout: ' + out);
       console.log('stderr: ' + err);
     }
   })


  }
 //      let running_scripts = require('child_process').exec('sh bash_script.sh', (e, out, err) => {
  //        console.log(`out: ${out}`);
  //        console.log(`err: ${err}`);
  //      })
})

