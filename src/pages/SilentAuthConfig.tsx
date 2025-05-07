import React, { useState } from "react";
import ApiService from '@/services/api';

const SilentAuthConfig: React.FC = () => {
  const [form, setForm] = useState({
    aid: "",
    username: "",
    password: "",
    refreshToken: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.aid) errs.aid = "AID is required";
    if (!form.username) errs.username = "Username is required";
    if (!form.password) errs.password = "Password is required";
    if (!form.refreshToken) errs.refreshToken = "Refresh token is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (validate()) {
      setLoading(true);
      try {
        const res = await ApiService.saveSilentAuthConfig({
          aid: form.aid,
          userName: form.username,
          password: form.password,
          refreshToken: form.refreshToken,
        });
        if (res.statusCode !== 200) {
          throw new Error(res.message || 'Failed to save config');
        }
        setMessage('Silent Auth Config saved successfully!');
        setForm({ aid: '', username: '', password: '', refreshToken: '' });
      } catch (error: any) {
        setMessage(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-[60vh] px-2">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-6 md:space-y-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Silent Auth Config</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="aid">
              AID
            </label>
            <input
              type="text"
              name="aid"
              id="aid"
              value={form.aid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="off"
            />
            {errors.aid && (
              <p className="text-red-500 text-xs mt-1">{errors.aid}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="refreshToken">
              Refresh Token
            </label>
            <input
              type="text"
              name="refreshToken"
              id="refreshToken"
              value={form.refreshToken}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="off"
            />
            {errors.refreshToken && (
              <p className="text-red-500 text-xs mt-1">{errors.refreshToken}</p>
            )}
          </div>
        </div>
        {message && (
          <div className={`text-center text-sm mb-2 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
        )}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SilentAuthConfig;
