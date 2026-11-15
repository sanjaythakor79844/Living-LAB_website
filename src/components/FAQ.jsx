export default function FAQ() {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="head center">
          <p className="k">Questions</p>
          <h2>Good to <em>know.</em></h2>
        </div>
        <div className="faq">
          <details open>
            <summary>Do I need to prepare anything?</summary>
            <p>No. You arrive, step in and talk. Liv guides the whole visit by voice.</p>
          </details>
          <details>
            <summary>Does the pod replace my doctor?</summary>
            <p>No. The pod supports wellness screening. A doctor reviews every report before it reaches you, and your own doctor's advice always comes first.</p>
          </details>
          <details>
            <summary>Which languages does Liv speak?</summary>
            <p>Liv speaks several Indian languages, so you can use the one you are most comfortable in.</p>
          </details>
          <details>
            <summary>What happens to my information?</summary>
            <p>You choose what you share before anything begins, and you can change your mind at any time.</p>
          </details>
          <details>
            <summary>I run a centre. How do I get a pod?</summary>
            <p>We deploy the pod inside your existing space and connect the therapies you already offer, tailored to your centre's tiers and commercials.</p>
          </details>
          <details>
            <summary>Where can I see one?</summary>
            <p>Our first pod is live at the pilot centre in Aundh, Pune, showcasing the pod and the Liv app.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
