import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      toast.success('로그인 성공!');
      navigate('/');
    } else {
      toast.error('로그인 실패. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full" loading={loading}>
            로그인
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
