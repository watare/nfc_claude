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
    } else if (formData.firstName.trim().length < 2 || formData.firstName.trim().length > 50) {
      errors.firstName = 'Le prénom doit contenir entre 2 et 50 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName.trim())) {
      errors.firstName = 'Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Nom requis';
    } else if (formData.lastName.trim().length < 2 || formData.lastName.trim().length > 50) {
      errors.lastName = 'Le nom doit contenir entre 2 et 50 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName.trim())) {
      errors.lastName = 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
    }

    if (!formData.email) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
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
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {error && (
        <div className="alert alert-danger rounded-3 mb-0" role="alert">
          {error.message}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Input
            label="Prénom"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={formErrors.firstName}
            required
            autoComplete="given-name"
            appearance="bootstrap"
          />
        </div>

        <div className="col-12 col-md-6">
          <Input
            label="Nom"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={formErrors.lastName}
            required
            autoComplete="family-name"
            appearance="bootstrap"
          />
        </div>
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
        appearance="bootstrap"
      />

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
            autoComplete="new-password"
            appearance="bootstrap"
          />
        </div>
        <div className="col-12 col-md-6">
          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            required
            autoComplete="new-password"
            appearance="bootstrap"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        appearance="bootstrap"
        className="w-100"
      >
        {isLoading ? 'Inscription...' : "S'inscrire"}
      </Button>

      {onSwitchToLogin && (
        <p className="text-center text-muted small mb-0">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={() => {
              clearError();
              onSwitchToLogin();
            }}
            className="btn btn-link p-0 align-baseline"
          >
            Se connecter
          </button>
        </p>
      )}
    </form>
  );
};