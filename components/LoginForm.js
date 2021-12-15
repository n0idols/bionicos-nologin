import useForm from "@/lib/useForm";

export default function LoginForm() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    email: "",
    password: "",
  });
  return (
    <div className="max-w-md mx-auto mt-16 border border-primary p-4 rounded-xl">
      <h1 className="text-center mt-8">Login</h1>
      <form className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="email"
          className="input input-bordered"
        />
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          className="input input-bordered"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChange}
        />

        <button className="btn block mx-12 my-4">Login</button>

        <div className="flex justify-center">
          <button type="button" className="btn btn-ghost" onClick={clearForm}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
