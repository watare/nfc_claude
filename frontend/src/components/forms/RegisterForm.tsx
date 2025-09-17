import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { RegisterRequest } from '../../types/api';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Prénom requis';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Nom requis';
    }

    if (!formData.email) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmation de mot de passe requise';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      onSuccess?.();
    } catch (err) {
      // L'erreur est déjà gérée par le hook useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Inscription</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={formErrors.firstName}
          required
          autoComplete="given-name"
        />

        <Input
          label="Nom"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={formErrors.lastName}
          required
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
        autoComplete="email"
      />

      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
        autoComplete="new-password"
      />

      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={formErrors.confirmPassword}
        required
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Inscription...' : "S'inscrire"}
      </Button>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Se connecter
          </button>
        </p>
      )}
    </form>
  );
};