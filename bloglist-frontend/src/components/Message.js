const Message = ({ text, state }) => {
  const success = {
    color: 'green',
    border: '3px solid green',
    backgroundColor: '#ccc',
    borderRadius: 4,
    fontSize: 20,
    padding: 8,
  };

  const failure = {
    color: 'red',
    border: '3px solid red',
    backgroundColor: '#ccc',
    borderRadius: 4,
    fontSize: 20,
    padding: 8,
  };

  return (
    <>
      {state && <p className="message" style={success}>{text}</p>}
      {!state && <p className="message" style={failure}>{text}</p>}
    </>
  );
};

export default Message;
