import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { LoginRequest } from '../../types/api';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [resetInfo, setResetInfo] = useState<{
    resetLink?: string;
    resetToken?: string;
    expiresAt?: string;
  } | null>(null);
  const [redirectingToRegister, setRedirectingToRegister] = useState(false);

  useEffect(() => {
    let redirectTimer: number | undefined;

    if (!error) {
      setResetInfo(null);
      setRedirectingToRegister(false);
      return () => {
        if (redirectTimer) {
          window.clearTimeout(redirectTimer);
        }
      };
    }

    if (error.code === 'INVALID_PASSWORD') {
      const details = error.details ?? {};
      setResetInfo({
        resetLink: typeof details?.resetLink === 'string' ? details.resetLink : undefined,
        resetToken: typeof details?.resetToken === 'string' ? details.resetToken : undefined,
        expiresAt: typeof details?.expiresAt === 'string' ? details.expiresAt : undefined,
      });
    } else {
      setResetInfo(null);
    }

    if (error.code === 'USER_NOT_FOUND' && onSwitchToRegister) {
      setRedirectingToRegister(true);
      redirectTimer = window.setTimeout(() => {
        clearError();
        onSwitchToRegister();
      }, 1200);
    } else {
      setRedirectingToRegister(false);
    }

    return () => {
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [error, onSwitchToRegister, clearError]);

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

    if (!formData.email) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
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
      await login(formData);
      onSuccess?.();
    } catch {
      // L'erreur est déjà gérée par le hook useAuth
    }
  };

  const formatExpiration = (expiresAt?: string): string | undefined => {
    if (!expiresAt) {
      return undefined;
    }

    const timestamp = Number.isNaN(Date.parse(expiresAt)) ? null : new Date(expiresAt);
    if (!timestamp) {
      return expiresAt;
    }

    try {
      return timestamp.toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return timestamp.toISOString();
    }
  };

  const errorMessage = error?.message;
  const alertVariant = error?.code === 'INVALID_PASSWORD' ? 'alert-warning' : 'alert-danger';

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {errorMessage && (
        <div className={`alert ${alertVariant} rounded-3 mb-0`} role="alert">
          <div className="d-flex flex-column gap-1">
            <span className="fw-semibold">{errorMessage}</span>
            {error?.code === 'USER_NOT_FOUND' && (
              <span className="small text-muted">
                Aucun compte ne correspond à cette adresse email. Nous vous redirigeons vers l'inscription pour créer un profil.
              </span>
            )}
            {redirectingToRegister && (
              <span className="small fst-italic text-muted">
                Redirection en cours...
              </span>
            )}
          </div>
        </div>
      )}

      {resetInfo && (
        <div className="alert alert-info rounded-3 mb-0" role="status">
          <div className="small">
            <span className="fw-semibold d-block">Mode démonstration :</span>
            <span className="d-block mt-1">
              Aucun serveur mail n'est configuré. Utilisez le lien ci-dessous pour réinitialiser le mot de passe.
            </span>
            {resetInfo.resetLink && (
              <a href={resetInfo.resetLink} className="d-block mt-2 text-break fw-semibold">
                {resetInfo.resetLink}
              </a>
            )}
            {!resetInfo.resetLink && resetInfo.resetToken && (
              <span className="d-block mt-2 text-break">
                Jeton de réinitialisation : <code>{resetInfo.resetToken}</code>
              </span>
            )}
            {formatExpiration(resetInfo.expiresAt) && (
              <span className="d-block mt-2 text-muted">
                Valide jusqu'au {formatExpiration(resetInfo.expiresAt)}
              </span>
            )}
          </div>
        </div>
      )}

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

      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
        autoComplete="current-password"
        appearance="bootstrap"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        appearance="bootstrap"
        className="w-100"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>

      {onSwitchToRegister && !redirectingToRegister && (
        <p className="text-center text-muted small mb-0">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={() => {
              clearError();
              onSwitchToRegister();
            }}
            className="btn btn-link p-0 align-baseline"
          >
            Créer un compte
          </button>
        </p>
      )}
    </form>
  );
};