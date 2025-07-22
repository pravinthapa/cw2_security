import { useState, useEffect } from 'react';

export interface PasswordStrength {
  score: number; // 0-4
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  feedback: string[];
  color: string;
  percentage: number;
}

export const usePasswordStrength = (password: string): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    level: 'Very Weak',
    feedback: [],
    color: 'hsl(var(--destructive))',
    percentage: 0,
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        level: 'Very Weak',
        feedback: [],
        color: 'hsl(var(--muted))',
        percentage: 0,
      });
      return;
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add lowercase letters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add special characters (!@#$%^&*)');
    }

    // Bonus points for length
    if (password.length >= 12) {
      score += 1;
    }

    // Cap the score at 4
    score = Math.min(score, 4);

    // Determine level and color
    let level: PasswordStrength['level'];
    let color: string;

    switch (score) {
      case 0:
      case 1:
        level = 'Very Weak';
        color = 'hsl(var(--destructive))';
        break;
      case 2:
        level = 'Weak';
        color = 'hsl(var(--warning))';
        break;
      case 3:
        level = 'Fair';
        color = 'hsl(35 85% 65%)'; // Orange
        break;
      case 4:
        level = 'Good';
        color = 'hsl(var(--accent))';
        break;
      default:
        level = 'Strong';
        color = 'hsl(var(--success))';
        break;
    }

    // If we have all requirements plus length bonus, it's strong
    if (score >= 5) {
      level = 'Strong';
      color = 'hsl(var(--success))';
    }

    const percentage = Math.min((score / 4) * 100, 100);

    setStrength({
      score,
      level,
      feedback,
      color,
      percentage,
    });
  }, [password]);

  return strength;
};