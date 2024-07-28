import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-primary-800 pt-12 md:pt-16">
      <div className="section-container">
        <h1 className="text-center text-3xl font-bold text-white md:text-5xl">
          Games
        </h1>
        <div>
          <div>
            <img
              src="https://mediumrare.imgix.net/15a51a2ae2895872ae2b600fa6fe8d7f8d32c9814766b66ddea2b288d04ba89c?&dpr=2.0000000298023224&format=auto&auto=format&q=50&w=167"
              alt="mineGameImage"
              className="w-44 cursor-pointer rounded-lg object-cover"
              onClick={() => {
                navigate("/mine");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
