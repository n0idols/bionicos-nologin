import useForm from "@/lib/useForm";

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: "Nice Shoes",
    price: 34234,
    description: "These are the best shoes!",
  });

  function handleSubmit() {
    console.log("hey");
  }

  return (
    <form className="form-control">
      <label
        htmlFor="name"
        className="input-group input-group-vertical input-group-lg"
      >
        <span>Name</span>
        <input
          className="input input-bordered input-lg"
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label
        htmlFor="price"
        className="input-group input-group-vertical input-group-lg"
      >
        <span>Price</span>
        <input
          className="input input-bordered input-lg"
          type="number"
          id="price"
          name="price"
          placeholder="price"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>
      <div className="">
        <button type="button" className="btn" onClick={handleSubmit}>
          Add Product
        </button>
      </div>
      <div className="">
        <button type="button" className="btn" onClick={clearForm}>
          Clear Form
        </button>
        <button type="button" className="btn" onClick={resetForm}>
          Reset Form
        </button>
      </div>
    </form>
  );
}
