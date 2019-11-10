const firstName = ["Runny", "Buttercup", "Dinky", "Stinky", "Crusty",
"Greasy","Gidget", "Cheesypoof", "Lumpy", "Wacky", "Tiny", "Flunky",
"Fluffy", "Zippy", "Slimy", "Grimy", "Salamander",
"Oily", "Burrito", "Bumpy", "Loopy", "Snotty", "Irving", "Egbert"];

const middleName =["Waffer", "Lilly","Rugrat","Sand", "Fuzzy","Kitty",
 "Puppy", "Snuggles","Rubber", "Stinky", "Lulu", "Lala", "Sparkle", "Glitter",
 "Silver", "Golden", "Rainbow", "Cloud", "Rain", "Stormy", "Wink", "Sugar",
 "Twinkle", "Star", "Halo", "Angel"];

const lastName1 = ["Snicker", "Buffalo", "Gross", "Bubble", "Sheep",
"Lizard", "Waffle", "Burger", "Chimp", "Liver",
 "Gorilla", "Rhino", "Emu", "Pizza", "Toad", "Gerbil", "Pickle", "Tofu", 
"Chicken", "Potato", "Hamster", "Lemur", "Vermin"];

const lastName2 = ["face", "dip", "nose", "brain", "head", "breath", 
"pants", "shorts", "mouth", "muffin", "elbow", "toes", "chunks", 
"brains", "wit", "juice", "shower", '', '',];

const randomElement = (names: string[]) => {
  const index = Math.floor(Math.random() * names.length);
  return names[index];
}

export default function funnyName() {
  return `${randomElement(firstName)} ${randomElement(lastName1)}${randomElement(lastName2)}`;
};
