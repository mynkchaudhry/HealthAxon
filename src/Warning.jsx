import "./Warning.css";

export default function Warning({children, password}) {
  return (
    <>
      <input type="password" value={password} className="warning"></input>
      {children}
    </>
  );
}
