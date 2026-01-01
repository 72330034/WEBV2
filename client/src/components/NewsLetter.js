import "../styles/NewsLetter.css";

const NewsLetter=()=> {
  return (
    <div className="newsletter">
      <h2>Join Our Newsletter</h2>
      <p>Be the first to know about new arrivals and exclusive offers.</p>

      <div className="newsletter-box">
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
    </div>
  );
}
export default NewsLetter;