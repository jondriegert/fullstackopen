import { useState, useEffect } from 'react';
import personService from './services/persons';

const Notification = ({ message }) => {
  if (message === null || message === '') {
    return null;
  }

  return <div className='notification'>{message}</div>;
};

const ErrorNotification = ({ message }) => {
  if (message === null || message === '') {
    return null;
  }

  return <div className='error'>{message}</div>;
};

const Filter = ({ search, handler }) => (
  <div>
    filter shown with a <input value={search} onChange={handler} />
  </div>
);

const PersonForm = ({ submit, name, number, nameHandler, numberHandler }) => (
  <form onSubmit={submit}>
    <div>
      name: <input value={name} onChange={nameHandler} />
    </div>
    <div>
      number: <input value={number} onChange={numberHandler} />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
);

const Person = ({ name, number, removePerson }) => (
  <div>
    {name} {number} <button onClick={removePerson}>delete</button>
  </div>
);

const Persons = ({ persons, search, removePerson }) => {
  const newPersons = persons.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {newPersons.map((person) => (
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          removePerson={() => removePerson(person.id)}
        />
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((p) => p.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changePerson = persons.find((n) => n.name === newName);

        personService
          .update(changePerson.id, nameObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== changePerson.id ? p : returnedPerson
              )
            );
            setNotificationMessage(`Changed number for ${returnedPerson.name}`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${changePerson.name} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== changePerson.id));
          });
      }
      setNewName('');
      setNewNumber('');
      return;
    }

    personService.create(nameObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNotificationMessage(`Added ${returnedPerson.name}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
      setNewName('');
      setNewNumber('');
    });
  };

  const removeName = (id) => {
    const personName = persons.find((n) => n.id === id).name;
    if (window.confirm(`Delete ${personName} ?`)) {
      personService.remove(id).catch((error) => {
        setErrorMessage(
          `Information of ${personName} has already been removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setPersons(persons.filter((p) => p.id !== id));
      });
      setPersons(persons.filter((n) => n.id !== id));
      setNotificationMessage(`Deleted ${personName}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />

      <Notification message={notificationMessage} />

      <Filter search={search} handler={handleSearchChange} />

      <h3>add a new</h3>
      <PersonForm
        submit={addName}
        name={newName}
        number={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} search={search} removePerson={removeName} />
    </div>
  );
};

export default App;
