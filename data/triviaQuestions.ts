export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  movie: string;
}

export const triviaQuestions: Question[] = [
  {
    id: 1,
    question: "What is the name of the main character in 'A Christmas Carol' who is visited by three ghosts?",
    options: ["Bob Cratchit", "Ebenezer Scrooge", "Tiny Tim", "Jacob Marley"],
    correctAnswer: 1,
    movie: "A Christmas Carol"
  },
  {
    id: 2,
    question: "In 'Home Alone', what is Kevin's last name?",
    options: ["Smith", "Johnson", "McCallister", "Williams"],
    correctAnswer: 2,
    movie: "Home Alone"
  },
  {
    id: 3,
    question: "What does Buddy the Elf put on his spaghetti in 'Elf'?",
    options: ["Ketchup", "Maple syrup", "Chocolate syrup", "All of the above"],
    correctAnswer: 3,
    movie: "Elf"
  },
  {
    id: 4,
    question: "In 'The Grinch', what is the name of the town the Grinch terrorizes?",
    options: ["Whoville", "Christmasville", "Holiday Town", "North Pole"],
    correctAnswer: 0,
    movie: "The Grinch"
  },
  {
    id: 5,
    question: "What is the name of the department store where Kevin gets separated from his family in 'Home Alone'?",
    options: ["Macy's", "Sears", "Toys R Us", "None of the above"],
    correctAnswer: 3,
    movie: "Home Alone"
  },
  {
    id: 6,
    question: "In 'It's a Wonderful Life', what is the name of the angel who helps George Bailey?",
    options: ["Clarence", "Gabriel", "Michael", "Raphael"],
    correctAnswer: 0,
    movie: "It's a Wonderful Life"
  },
  {
    id: 7,
    question: "What is the name of the snowman that comes to life in 'Frozen'?",
    options: ["Frosty", "Olaf", "Snowy", "Jack"],
    correctAnswer: 1,
    movie: "Frozen"
  },
  {
    id: 8,
    question: "In 'The Polar Express', what happens if you lose your ticket?",
    options: ["You get kicked off", "It disappears", "It punches a hole in your ticket", "Nothing"],
    correctAnswer: 2,
    movie: "The Polar Express"
  },
  {
    id: 9,
    question: "What is the name of the main character in 'A Christmas Story'?",
    options: ["Ralphie", "Randy", "Flick", "Schwartz"],
    correctAnswer: 0,
    movie: "A Christmas Story"
  },
  {
    id: 10,
    question: "In 'Miracle on 34th Street', what is the name of the department store Santa?",
    options: ["Kris Kringle", "Santa Claus", "Saint Nicholas", "Father Christmas"],
    correctAnswer: 0,
    movie: "Miracle on 34th Street"
  },
  {
    id: 11,
    question: "What does Ralphie want for Christmas in 'A Christmas Story'?",
    options: ["A bike", "A Red Ryder BB gun", "A train set", "A puppy"],
    correctAnswer: 1,
    movie: "A Christmas Story"
  },
  {
    id: 12,
    question: "In 'Elf', what is Buddy's real name before he discovers he's an elf?",
    options: ["Walter Hobbs", "Buddy Hobbs", "Michael Hobbs", "He doesn't have one"],
    correctAnswer: 1,
    movie: "Elf"
  },
  {
    id: 13,
    question: "What is the name of the train in 'The Polar Express'?",
    options: ["The Christmas Express", "The Polar Express", "The North Pole Express", "The Holiday Express"],
    correctAnswer: 1,
    movie: "The Polar Express"
  },
  {
    id: 14,
    question: "In 'Home Alone 2', which city does Kevin get lost in?",
    options: ["Chicago", "New York", "Los Angeles", "Boston"],
    correctAnswer: 1,
    movie: "Home Alone 2"
  },
  {
    id: 15,
    question: "What is the name of the reindeer with the red nose?",
    options: ["Rudolph", "Dasher", "Prancer", "Comet"],
    correctAnswer: 0,
    movie: "Rudolph the Red-Nosed Reindeer"
  }
];

