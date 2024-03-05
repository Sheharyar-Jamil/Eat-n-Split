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
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends(function (friends) {
      return [...friends, friend];
    });
    setShowAddFriend(false);
  }
  function handleShowAddFriend() {
    setShowAddFriend(function (showAddFriend) {
      return !showAddFriend;
    });
  }

  function handleSelection(friend) {
    setSelectedFriend(function (curFriend) {
      return curFriend?.id === friend?.id ? null : friend;
    });

    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(function (friend) {
      return friend.map(function (curFriend) {
        return curFriend.id === selectedFriend.id
          ? { ...curFriend, balance: curFriend.balance + value }
          : curFriend;
      });
    });

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelected={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelected, selectedFriend }) {
  return (
    <ul>
      {friends.map(function (friend) {
        return (
          <Friend
            friendObj={friend}
            key={friend.id}
            onSelected={onSelected}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friendObj, onSelected, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{friendObj.name}</h3>

      {friendObj.balance < 0 ? (
        <p className="red">
          You owe {friendObj.name} {Math.abs(friendObj.balance)}
        </p>
      ) : friendObj.balance > 0 ? (
        <p className="green">
          {friendObj.name} owes you ${friendObj.balance}
        </p>
      ) : (
        <p>You and {friendObj.name} are even</p>
      )}
      <Button onClick={() => onSelected(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleImageChange(event) {
    setImage(event.target.value);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input type="text" value={name} onChange={handleNameChange} />
      <label>🖼️ Image URL</label>
      <input type="text" value={image} onChange={handleImageChange} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleBillChange(event) {
    setBill(Number(event.target.value));
  }

  function handlePaidChange(event) {
    setPaidByUser(
      Number(event.target.value) > bill
        ? paidByUser
        : Number(event.target.value)
    );
  }

  function handleWhoChange(event) {
    setWhoIsPaying(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByFriend);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split A Bill With {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input type="text" value={bill} onChange={handleBillChange} />
      <label>🕴️ Your Expense</label>
      <input type="text" value={paidByUser} onChange={handlePaidChange} />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill?</label>
      <select value={whoIsPaying} onChange={handleWhoChange}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
