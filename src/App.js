import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=4e9476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitSubmit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <button className="button" onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </button>
        <Button />
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitSubmit}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelect = selectedFriend?.id === friend.id;
  return (
    <li className={isSelect ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You own {friend.name} {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owns you {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <button className="button" onClick={() => onSelection(friend)}>
        {isSelect ? "close" : "select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}? = ${id}`,
      balancea: 0,
      id,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑🏻‍🤝‍🧑🏿friendname</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label> 🖼️image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button className="button">Add</button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoToPay, setWhoToPay] = useState("user");

  function handleSubmit2(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(whoToPay === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit2}>
      <h2>Split bills with {selectedFriend.name}</h2>
      <label>🤑Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧑🏻‍🤝‍🧑🏿Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value > bill ? paidByUser : Number(e.target.value))
          )
        }
      />

      <label>🧑🏻‍🤝‍🧑🏿{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoToPay} onChange={(e) => setWhoToPay(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="button">Add</button>
    </form>
  );
}
