import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.token);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      navigate(payload.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    },
    onError: () => alert('Login failed'),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <Label>Username</Label>
      <Input
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <Label>Password</Label>
      <Input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <Button type="submit" className="w-full" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
