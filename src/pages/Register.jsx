import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const registerSchema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        '비밀번호는 영문과 숫자를 포함해야 합니다'
      ),
    confirmPassword: z.string(),
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
    phone: z
      .string()
      .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '유효한 전화번호를 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerUser(data);
    if (success) {
      toast.success('회원가입 성공! 로그인해주세요.');
      navigate('/login');
    } else {
      toast.error('회원가입 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="bg-white rounded-3xl shadow-apple-lg p-10">
        <h1 className="text-4xl font-semibold text-center mb-10 tracking-tight">회원가입</h1>

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

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="********"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Input
            label="이름"
            type="text"
            placeholder="홍길동"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="전화번호"
            type="tel"
            placeholder="010-1234-5678"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Button type="submit" className="w-full mt-8" loading={loading}>
            회원가입
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-primary-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
