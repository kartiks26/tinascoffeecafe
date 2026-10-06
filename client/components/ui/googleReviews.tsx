"use client";

const reviews = [
  {
    name: "Yuri Djachenko",
    rating: 5,
    date: "3 days ago",
    text: "Superb coffee, the best I’ve ever had in Toowoomba (I’m 57 years old and travelled the world and the coffee we make at home is better than most).",
    details: "Food: 5/5 | Service: 5/5",
  },
  {
    name: "pat walker",
    rating: 5,
    date: "a day ago",
    text: "Really good coffee. 5 star. Brekkie wrap mmm mmmm. Veggie wrap 5star, Chilli scramble 5star. Very friendly and accommodating. Need another person on and it’s bloomin perfect",
    details: "Food: 5/5 | Service: 3/5 | Atmosphere: 5/5",
  },
  {
    name: "David Bradford",
    rating: 5,
    date: "a week ago",
    text: "The Food is superb has flavour and the presentation is beautiful on the plate it leaves a great flavour in the mouth. The bonus is the coffee is also great. Would strongly recommend this Cafe",
    details: "Food: 5/5 | Service: 5/5 | Atmosphere: 5/5",
  },
];

export default function GoogleReviews() {
  return (
    <section className="bg-[#f5f0e8] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#806c5a]">
            Google Reviews
          </p>

          <h2 className="font-serif text-4xl text-[#30241d] md:text-5xl">
            What our customers say
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-2xl font-semibold text-[#30241d]">4.8</span>

            <span className="text-xl tracking-wide text-[#d49a3a]">★★★★★</span>

            <span className="text-sm text-[#806c5a]">Google Reviews</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex flex-col rounded-[2rem] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              {/* Stars */}
              <div className="mb-5 flex gap-1 text-[#d49a3a]">{"★★★★★"}</div>

              {/* Review */}
              <p className="flex-1 text-[15px] leading-7 text-[#44372f]">
                “{review.text}”
              </p>

              {/* Details */}
              <p className="mt-6 border-t border-[#eee7de] pt-5 text-xs text-[#806c5a]">
                {review.details}
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#30241d]">
                    {review.name}
                  </p>

                  <p className="mt-1 text-xs text-[#9a8c80]">
                    Google · {review.date}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0ebe3] text-xs font-semibold text-[#6b5848]">
                  G
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Google button */}
        <div className="mt-10 text-center">
          <a
            href="https://www.google.com/search?q=tina%E2%80%99s+place+cafe+%26+catering.%F0%9F%92%95+reviews&oq=tin&gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MgYIABBFGDwyCAgBEEUYJxg7MggIAhBFGCcYOzIGCAMQRRg5MgYIBBBFGDwyBggFEEUYPDIGCAYQRRg9MgYIBxBFGD3SAQgyMTkxajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x6b965d1a7b0e5baf:0xfce9b5d7b7320700,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#30241d] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#4a382d]"
          >
            Read all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
