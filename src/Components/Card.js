import React, { useState, useEffect } from 'react';
import BollywoodMovies from '../BollywoodMovies';
import BollywoodMoviesRatings from '../BollywoodMoviesRatings';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import correctSVG from '../SVGs/correct.svg';
import wrongSVG from '../SVGs/wrong.svg';
// import BollywoodLogo from '../SVGs/bollywood-logo.svg';
import ImageNotFound from '../SVGs/images.png';
import '../App.css';

BollywoodMovies.forEach(movie => {
    BollywoodMoviesRatings.forEach(rating => {
        if (movie.imdb_id === rating.imdb_id) {
            movie['ratings'] = rating.imdb_rating;
            movie['votes'] = rating.imdb_votes;
        }
    });
});

let MovieArray = BollywoodMovies.filter(movie => movie.ratings > 5 && movie.votes > 7000);

function Card() {
    // Picking Random Movies from an Array
    const rnum1 = MovieArray[Math.floor(Math.random() * MovieArray.length)];
    const rnum2 = MovieArray[Math.floor(Math.random() * MovieArray.length)];
    const rnum3 = MovieArray[Math.floor(Math.random() * MovieArray.length)];

    // Inserting them in a new Array
    const getMovies = [rnum1, rnum2];
    const [movies, setMovies] = useState(getMovies);

    // Conditional Rendering
    const [lost, setLost] = useState('undefined');
    const [animate, setAnimate] = useState(false);
    const [score, setScore] = useState(0);
    const [showCounter, setShowCounter] = useState(false);
    const [showMenu, setShowMenu] = useState(true);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const storedHighScore = localStorage.getItem('highScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    // Option to Play with Ratings or Votes
    const withRatings = true;

    // Mapping through Json
    const displayMovies = movies.map((movie, index) => {
        if (index === 0) {
            return (
                <motion.div exit={{ x: '-50%' }} className='section1' key={index}>
                    <img src={ImageNotFound} alt="" className='movie-bg2' />
                    <img src={movie.poster_path} alt="" className="movie-bg" />
                    <div className="about-movie">
                        <h2 className='movie-title'>'{movie.title}'</h2>
                        <h3> is rated <span style={{ fontSize: '30px' }}>{movie.ratings}</span> on IMDb</h3>
                    </div>
                </motion.div>
            );
        } else if (index === 1) {
            return (
                <motion.div className={animate ? 'section2-animate' : 'section2'} key={index}>
                    <div className='section3'></div>
                    <img src={ImageNotFound} alt="" className='movie-bg2' />
                    <img src={movie.poster_path} alt="" className="movie-bg" />
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="about-movie">
                        <h2 className='movie-title'><b>'{movie.title}'</b> is rated?</h2>
                        <div className="btn-wrapper">
                            <button className="btn" onClick={() => handleClickHigher()}>Higher<div className='arrow-up'></div> </button>
                            <button className="btn" onClick={() => handleClickLower()}>Lower <div className='arrow-down'></div></button>
                        </div>
                        <AnimatedCounter />
                    </motion.div>
                </motion.div>
            );
        }
        return null;
    });

    // Functions
    function handleClickHigher() {
        setShowCounter(true);
        if (withRatings) {
            movies[0].ratings < movies[1].ratings ? guessedCorrect() : movies[0].ratings === movies[1].ratings ? guessedCorrect() : guessedWrong();
        } else {
            movies[0].votes < movies[1].votes ? guessedCorrect() : movies[0].votes === movies[1].votes ? guessedCorrect() : guessedWrong();
        }
    }

    function handleClickLower() {
        setShowCounter(true);
        if (withRatings) {
            movies[0].ratings > movies[1].ratings ? guessedCorrect() : movies[0].ratings === movies[1].ratings ? guessedCorrect() : guessedWrong();
        } else {
            movies[0].votes > movies[1].votes ? guessedCorrect() : movies[0].votes === movies[1].votes ? guessedCorrect() : guessedWrong();
        }
    }

    function guessedCorrect() {
        setScore(prevScore => {
            const newScore = prevScore + 1;
            if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('highScore', newScore);
            }
            return newScore;
        });
        setLost('false');
        setShowCounter(true);
        setTimeout(() => {
            setShowCounter(false);
            setAnimate(true);
            setLost('undefined');
            setTimeout(() => {
                setShowCounter(false);
                setMovies(movie => {
                    const oldMovies = [...movie].splice(1, 1);
                    const newMovie = [...oldMovies, rnum3];
                    return newMovie;
                });
                setAnimate(false);
            }, 500);
        }, 800);
    }

    function guessedWrong() {
        setLost('animate');
        setTimeout(() => {
            setLost('true');
        }, 1000);
    }

    function resetGame() {
        setLost('undefined');
        setMovies(getMovies);
        setScore(0);
        setShowCounter(false);
    }

    // Components
    function Menu() {
        return (
            <div className="Menu">
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <div className="menu-card">
                    <h3>HIGHER LOWER</h3>
                    {/* <img src={BollywoodLogo} alt="" className='bollywood-logo'/> */}
                    <h4>EDITION</h4>
                    <p className="about-higher-lower">
                        Guess the IMDb ratings of given two movies
                    </p>
                    <button className='play-btn' onClick={() => setShowMenu(false)}> Play now</button>
                    <p className="note">
                        <b style={{ color: 'yellow' }}>Note:</b> The data is obtained from old data set &#40;2021&#41; if you know any better resource or free APIs, be sure to contact me.
                    </p>
                </div>
            </div>
        );
    }

    function AnimatedCounter() {
        if (withRatings) {
            return <CountUp className='counter' style={showCounter ? { opacity: 1 } : { opacity: 0 }} end={showCounter ? movies[1].ratings : 0} decimals={1} duration={0.3} />;
        } else {
            return <CountUp className='counter' style={showCounter ? { opacity: 1 } : { opacity: 0 }} end={showCounter ? movies[1].votes : 0} duration={0.3} />;
        }
    }

    function YouLost() {
        return (
            <div className="lost-overlay">
                <div className="menu-card">
                    <h3>You Scored:</h3>
                    <h1 style={{ fontSize: '80px', marginTop: '20px' }}>{score}</h1>
                    <h3>High Score:</h3>
                    <h1 style={{ fontSize: '80px', marginTop: '20px' }}>{highScore}</h1>
                    <button onClick={() => resetGame()} className="play-btn"> Play Again</button>
                    <button onClick={() => setShowMenu(true)} className="play-btn"> Back to menu</button>
                </div>
            </div>
        );
    }

    function AnimateAnswer() {
        if (lost === 'undefined') {
            return (
                <div className="circle">
                    <h1 className='VS'>VS</h1>
                </div>
            );
        } else if (lost === 'animate') {
            return (
                <div className='circle'>
                    <div className='wrong'></div>
                    <img className='answer-svg' alt='' src={wrongSVG} />
                </div>
            );
        } else if (lost === 'false') {
            return (
                <div className='circle'>
                    <div className='correct'></div>
                    <img className='answer-svg' alt='' src={correctSVG} />
                </div>
            );
        }
    }

    function DisplayCards() {
        return (
            <>
                {displayMovies}
                <AnimateAnswer />
                {lost === 'true' ? <YouLost /> : null}
                <h2 className='score'>Score: {score}</h2>
                <div className='high-score-display'>High Score: {highScore}</div>
            </>
        );
    }

    return (
        <AnimatePresence className='App'>
            {showMenu ? <Menu /> : <DisplayCards />}
        </AnimatePresence>
    );
}

export default Card;
