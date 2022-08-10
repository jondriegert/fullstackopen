import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const sortAnecdotes = (anecdotes) => {
  return anecdotes.sort((a, b) => {
    return b.votes - a.votes;
  });
};

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);

  const anecdotes = sortAnecdotes([
    ...useSelector((state) => state.anecdotes),
  ]).filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote));
            dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
          }}
        />
      ))}
    </>
  );
};

export default AnecdoteList;
