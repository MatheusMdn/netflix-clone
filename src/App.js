import React, { useEffect, useState } from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeatureMovie from "./components/FeatureMovie";
import Loading from "./components/Loading";
import Header from "./components/Header";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [featureMovie, setFeatureMovie] = useState([]);
  const [blackHeader, setBlackHeader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);
      setLoading(false);

      // Pegando o featured
      let originals = list.filter((item) => item.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      console.log(chosenInfo);
      setFeatureMovie(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="wrapper">
          <Header black={blackHeader} />
          {featureMovie && <FeatureMovie item={featureMovie} />}

          <section className="lists">
            {movieList.map((item, key) => (
              <MovieRow key={key} title={item.title} items={item.items} />
            ))}
          </section>
          <footer>
            Feito para estudo de react, todos os direitos das imagens são da
            Netflix. <br />
            Dados Extraidos de{" "}
            <a href="https://www.themoviedb.org/">TheMovieDB</a>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
