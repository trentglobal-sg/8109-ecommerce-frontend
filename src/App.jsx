export default function App() {
  return (<>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">E-Shop</a>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header className="bg-primary text-white text-center py-5">
      <div className="container">
        <h1 className="display-4">Welcome to E-Shop</h1>
        <p className="lead">Discover amazing products at unbeatable prices!</p>
        <a href="#" className="btn btn-light btn-lg">Shop Now</a>
      </div>
    </header>

    <main className="container my-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://picsum.photos/id/20/300/200"
              className="card-img-top"
              alt="Product 1"
            />
            <div className="card-body">
              <h5 className="card-title">Product 1</h5>
              <p className="card-text">$19.99</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://picsum.photos/id/1/300/200"
              className="card-img-top"
              alt="Product 2"
            />
            <div className="card-body">
              <h5 className="card-title">Product 2</h5>
              <p className="card-text">$29.99</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://picsum.photos/id/26/300/200"
              className="card-img-top"
              alt="Product 3"
            />
            <div className="card-body">
              <h5 className="card-title">Product 3</h5>
              <p className="card-text">$39.99</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://picsum.photos/id/96/300/200"
              className="card-img-top"
              alt="Product 4"
            />
            <div className="card-body">
              <h5 className="card-title">Product 4</h5>
              <p className="card-text">$49.99</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
      </div>
    </footer>


  </>)
}