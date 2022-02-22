const logo = `text-center tracking-tighter md:text-4xl text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-900`;

export default function FeaturedItem() {
  return (
    <>
      <h1 className={logo}>Customer Favorites</h1>
      <div className="mx-auto flex justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <figure className="px-10 pt-10">
            <img
              src="https://api.lorem.space/image/shoes?w=400&h=225"
              alt="Shoes"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
