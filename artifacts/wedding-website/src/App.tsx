import { useEffect, useRef, useState, type PointerEvent } from 'react';
import rsvpCouple from '@assets/chat_edit_image_20260912_160327_1791112818042.png';
import detailsCouple from '@assets/ChatGPT_Image_Sep_12,_2026,_08_18_53_PM_1791112818114.png';
import goldLadoo from '@assets/generated_images/shaadi_ladoo_gold_leaf_512.png';
import weddingEmblem from './wedding-emblem.png';

type Page = 'home' | 'questions' | 'details';
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

function pageUrl(path: string) {
  return `${BASE_PATH}${path}`;
}

const COMPLETION_KEY = 'wedding-rsvp-questions-complete';
const questions = [
  {
    prompt: 'How excited are you to celebrate with us?',
    answers: [
      { text: 'So excited. I’m already planning my entrance.', feedback: 'A grand entrance? The band has been warned.' },
      { text: 'Can’t wait.', feedback: 'Excellent. We’ll keep a dance-floor spot warm.' },
      { text: 'Mostly here for the food.', feedback: 'A very sensible RSVP strategy. Come hungry.' },
      { text: 'Unlimited gol gappe? Say less.', feedback: 'The gol gappe station just got its most enthusiastic RSVP.' },
      { text: 'Wait, you’re getting married?', feedback: 'We’ll act surprised when you shout ‘congratulations!’' },
    ],
  },
  {
    prompt: 'Are you going to cry during the ceremony?',
    answers: [
      { text: 'Obviously.', feedback: 'Tissues: now on the packing list.' },
      { text: 'Absolutely sobbing.', feedback: 'A full box has officially joined the guest list.' },
      { text: 'I’ll try to hold it together.', feedback: 'We admire the confidence. We’ll still bring tissues.' },
      { text: 'Only if everyone else cries first.', feedback: 'A carefully negotiated crying schedule.' },
      { text: 'No. I have excellent tear control.', feedback: 'Strong tear-duct discipline. We respect it.' },
    ],
  },
  {
    prompt: 'What are you bringing to the dance floor?',
    answers: [
      { text: 'Main-character energy.', feedback: 'The dance floor has been formally notified.' },
      { text: 'One move, perfected over years.', feedback: 'One perfect move beats a hundred average ones.' },
      { text: 'The enthusiasm, not the coordination.', feedback: 'A winning balance of heart and coordination.' },
      { text: 'A strategic snack break.', feedback: 'The snack table approves this plan.' },
      { text: 'My chair and moral support.', feedback: 'Front-row chair privileges are being arranged.' },
    ],
  },
];
const retryMessages = [
  'Nice try. Try again, wink.',
  'That button has plans.',
  'A little to the left?',
  'Still thinking about it?',
  'The dance floor is calling.',
  'Try your luck again.',
  'We admire the persistence.',
];
const functionDetails = [
  { name: 'Ring Ceremony & Mehendi', date: '13 December 2026', time: '7:30 PM', venue: 'Hotel Sun Ring', venueUrl: 'https://share.google/GIP3eAGBAr0x09dJ1' },
  { name: 'Haldi', date: '14 December 2026', time: '11:00 AM', venue: 'Narayanam Gardens', venueUrl: 'https://share.google/UK43AOikMd8q3Zova' },
  { name: 'Wedding Ceremony', date: '14 December 2026', time: '8:00 PM', venue: 'Narayanam Gardens', venueUrl: 'https://share.google/UK43AOikMd8q3Zova' },
];

function BrandFooter({ message }: { message: string }) {
  return (
    <footer className="rsvp-footer">
      <img className="footer-logo" src={weddingEmblem} alt="" aria-hidden="true" />
      <span>{message}</span>
    </footer>
  );
}

function currentPage(): Page {
  const path = window.location.pathname.slice(BASE_PATH.length).replace(/\/$/, '') || '/';
  if (path === '/rsvp/details') return 'details';
  if (path === '/rsvp/questions') return 'questions';
  return 'home';
}

function App() {
  const [page, setPage] = useState<Page>(() => {
    const requestedPage = currentPage();
    return requestedPage === 'details' && !sessionStorage.getItem(COMPLETION_KEY) ? 'home' : requestedPage;
  });
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noDodges, setNoDodges] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerMessage, setAnswerMessage] = useState('');
  const [answerSelected, setAnswerSelected] = useState(false);
  const noAreaRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncPage = () => {
      const requestedPage = currentPage();
      if (requestedPage !== 'questions') {
        setAnswerMessage('');
        setAnswerSelected(false);
      }
      if (requestedPage === 'details' && !sessionStorage.getItem(COMPLETION_KEY)) {
        window.history.replaceState({}, '', pageUrl('/'));
        setPage('home');
        return;
      }
      setPage(requestedPage);
      if (requestedPage === 'questions') setQuestionIndex(0);
    };
    syncPage();
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  useEffect(() => {
    document.title = page === 'details'
      ? 'Wedding RSVP · Celebration details'
      : page === 'questions' ? 'A little more about you · Wedding RSVP' : 'A Big Fat Wedding · RSVP';
  }, [page]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', pageUrl(path));
    setPage(currentPage());
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const handleNoPointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.type === 'pointerenter' && event.pointerType !== 'mouse') return;
    dodgeNoButton();
  };

  const dodgeNoButton = () => {
    const area = noAreaRef.current?.getBoundingClientRect();
    const button = noButtonRef.current?.getBoundingClientRect();
    if (!area || !button) return;
    const maxX = Math.max(0, area.width - button.width);
    const maxY = Math.max(0, area.height - button.height);
    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;
    if (maxX > 4 && Math.abs(nextX - noPosition.x) < 4) {
      setNoPosition({ x: maxX - nextX, y: maxY - nextY });
    } else {
      setNoPosition({ x: nextX, y: nextY });
    }
    setNoDodges((count) => count + 1);
  };

  const advanceAfterAnswer = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setAnswerMessage('');
      setAnswerSelected(false);
    } else {
      sessionStorage.setItem(COMPLETION_KEY, 'yes');
      setAnswerMessage('');
      setAnswerSelected(false);
      navigate('/rsvp/details');
    }
  };

  const answerQuestion = (answerIndex: number) => {
    if (answerSelected) return;
    setAnswerSelected(true);
    setAnswerMessage(questions[questionIndex].answers[answerIndex].feedback);
  };

  return (
    <div className="site-shell">
      <div className="page-wrap">
        <header className="masthead">
          <a
            className="brand"
            href={pageUrl('/')}
            aria-label="Wedding RSVP home"
            onClick={(event) => { event.preventDefault(); navigate('/'); }}
          >
            <img className="brand-logo" src={weddingEmblem} alt="Nishtha and Aseem wedding emblem" />
            <span className="brand-word">The Wedding RSVP</span>
          </a>
          <span className="edition">A little note for our favourite people</span>
        </header>

        {page === 'home' ? (
          <main className="page-enter" key="home">
            <section className="rsvp-hero" aria-labelledby="invitation-title">
              <div className="hero-copy">
                <div className="eyebrow">The big, joyful question</div>
                <h1 className="hero-title" id="invitation-title">Will you join our <em>celebration?</em></h1>
                <p className="hero-lede">
                  There will be colour, dancing, a heroic amount of food, and relatives asking if you’re next.
                  <strong> We wouldn’t have it any other way.</strong>
                </p>
                <p className="invite-note">Your presence is requested. Your dance moves are strongly encouraged.</p>
                <div className="button-row">
                  <button className="yes-button" type="button" data-testid="yes-rsvp-button" onClick={() => { setQuestionIndex(0); setAnswerMessage(''); setAnswerSelected(false); navigate('/rsvp/questions'); }}>
                    Yes, save me a ladoo <span className="button-arrow" aria-hidden="true">↗</span>
                  </button>
                </div>
                <div className="no-playfield" ref={noAreaRef} role="group" aria-label="Playful no button area">
                  <button
                    className="no-button"
                    ref={noButtonRef}
                    type="button"
                    style={{ left: noPosition.x, top: noPosition.y }}
                    onPointerEnter={handleNoPointer}
                    onPointerDown={(event) => { event.preventDefault(); dodgeNoButton(); }}
                    onClick={dodgeNoButton}
                    aria-describedby="no-explanation"
                    data-testid="no-rsvp-button"
                  >
                    No, I can’t make it
                  </button>
                </div>
                <p className="no-response" role="status" aria-live="polite" data-testid="no-rsvp-status">
                  {noDodges ? retryMessages[(noDodges - 1) % retryMessages.length] : ''}
                </p>
                <p className="no-explanation" id="no-explanation">
                  This button is only teasing. If you genuinely can’t make it, please contact the hosts directly.
                </p>
              </div>
              <figure className="hero-art">
                <img src={rsvpCouple} alt="Illustration of the couple dressed for a joyful Indian wedding celebration" />
                <img className="ladoo-sticker" src={goldLadoo} alt="" aria-hidden="true" />
                <figcaption className="art-caption">Big feelings.<br />Bigger feast.</figcaption>
              </figure>
            </section>
            <BrandFooter message="with love, nishtha and aseem" />
          </main>
        ) : page === 'questions' ? (
          <main className="page-enter quiz-page" key="questions">
            <div className="quiz-topline">
              <button className="back-link" type="button" data-testid="quiz-back-button" onClick={() => {
                if (questionIndex > 0) { setQuestionIndex((index) => index - 1); setAnswerMessage(''); setAnswerSelected(false); }
                else navigate('/');
              }}>
                <span aria-hidden="true">←</span> {questionIndex > 0 ? 'Previous question' : 'Back to invitation'}
              </button>
              <span className="eyebrow">A little more about you</span>
            </div>
            <section className="quiz-card" aria-labelledby="quiz-question" key={questionIndex}>
              <div className="quiz-progress-head">
                <span>Question {questionIndex + 1} of 3</span>
                <span>Be honest</span>
              </div>
              <div className="quiz-progress" aria-label={`Question ${questionIndex + 1} of 3`}>
                {questions.map((_, index) => <span key={index} className={index <= questionIndex ? 'progress-segment is-active' : 'progress-segment'} />)}
              </div>
              <h1 id="quiz-question" data-testid="text-quiz-question">{questions[questionIndex].prompt}</h1>
              {!answerSelected ? (
                <div className="answer-list" role="group" aria-labelledby="quiz-question">
                  {questions[questionIndex].answers.map(({ text }, index) => (
                    <button className="answer-option" type="button" key={text} onClick={() => answerQuestion(index)} data-testid={`answer-option-${index + 1}`}>
                      <span className="answer-marker" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="answer-feedback" data-testid="answer-feedback">
                  <span className="feedback-kicker">The wedding committee says</span>
                  <p className="feedback-message" role="status" aria-live="polite" aria-atomic="true">{answerMessage}</p>
                  <button className="continue-button" type="button" data-testid="continue-question-button" onClick={advanceAfterAnswer}>
                    {questionIndex === questions.length - 1 ? 'Reveal the details' : 'Continue'}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </section>
            <p className="quiz-footnote">No wrong answers. The snacks are still happening.</p>
            <BrandFooter message="with love, nishtha and aseem" />
          </main>
        ) : (
          <main className="page-enter" key="details">
            <div className="details-head">
              <button className="back-link" type="button" onClick={() => navigate('/')}>
                <span aria-hidden="true">←</span> Back to invitation
              </button>
              <span className="eyebrow">A yes! Excellent choice</span>
            </div>
            <section className="details-hero" aria-labelledby="details-title">
              <div>
                <div className="eyebrow">The celebrations, in outline</div>
                <h1 className="details-title" id="details-title">Three functions.<br />Many outfit changes.</h1>
                <p className="details-intro">We’re looking forward to celebrating together.</p>
              </div>
              <figure className="details-art">
                <img src={detailsCouple} alt="Illustration of the couple celebrating amid wedding lights and rose petals" />
                <figcaption className="detail-stamp">The<br />festivities<br />await</figcaption>
              </figure>
            </section>
            <svg className="details-garland" viewBox="0 0 500 56" aria-hidden="true" focusable="false">
              <path d="M4 4 C115 46 384 46 496 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M24 12 C122 44 378 44 476 12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 8" strokeLinecap="round" />
              <g fill="currentColor">
                <circle cx="45" cy="15" r="3.5"/><circle cx="105" cy="32" r="3.5"/><circle cx="170" cy="42" r="3.5"/>
                <circle cx="250" cy="46" r="3.5"/><circle cx="330" cy="42" r="3.5"/><circle cx="395" cy="32" r="3.5"/><circle cx="455" cy="15" r="3.5"/>
              </g>
              <g fill="#f5a900">
                <path d="M72 22c-6-6-13 1-6 8 3 3 6 5 6 5s3-2 6-5c7-7 0-14-6-8Z"/>
                <path d="M250 35c-6-6-13 1-6 8 3 3 6 5 6 5s3-2 6-5c7-7 0-14-6-8Z"/>
                <path d="M428 22c-6-6-13 1-6 8 3 3 6 5 6 5s3-2 6-5c7-7 0-14-6-8Z"/>
              </g>
            </svg>

            <section aria-label="Wedding function details" className="function-list">
              {functionDetails.map(({ name, date, time, venue, venueUrl }, index) => (
                <article className="function-card" key={name}>
                  <img className="function-card-ladoo" src={goldLadoo} alt="" aria-hidden="true" />
                  <div className="function-index">Function 0{index + 1}</div>
                  <h2>{name}</h2>
                  <div className="field">
                    <span className="field-label">Date</span>
                    <span className="field-placeholder">{date}</span>
                  </div>
                  <div className="field">
                    <span className="field-label">Time</span>
                    <span className="field-placeholder">{time}</span>
                  </div>
                  <div className="field">
                    <span className="field-label">Venue / address</span>
                    <span className="field-placeholder">
                      <a className="venue-link" href={venueUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open map and directions to ${venue}`}>
                        {venue}<span aria-hidden="true">↗</span>
                      </a>
                    </span>
                  </div>
                </article>
              ))}
            </section>
            <BrandFooter message="with love, nishtha and aseem" />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
