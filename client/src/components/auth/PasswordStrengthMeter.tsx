import React from 'react';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
}) => {
  const strength = usePasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Password Strength
          </span>
          <span 
            className="text-sm font-medium"
            style={{ color: strength.color }}
          >
            {strength.level}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${strength.percentage}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <RequirementItem
          text="At least 8 characters"
          met={password.length >= 8}
        />
        <RequirementItem
          text="Contains lowercase letter"
          met={/[a-z]/.test(password)}
        />
        <RequirementItem
          text="Contains uppercase letter"
          met={/[A-Z]/.test(password)}
        />
        <RequirementItem
          text="Contains number"
          met={/\d/.test(password)}
        />
        <RequirementItem
          text="Contains special character"
          met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)}
        />
      </div>
    </div>
  );
};

interface RequirementItemProps {
  text: string;
  met: boolean;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ text, met }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
          met
            ? 'bg-success text-success-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {met ? (
          <Check className="w-3 h-3" />
        ) : (
          <X className="w-3 h-3" />
        )}
      </div>
      <span
        className={`text-sm ${
          met ? 'text-success' : 'text-muted-foreground'
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default PasswordStrengthMeter;