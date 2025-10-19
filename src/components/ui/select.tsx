import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find((child: any) => child.type === SelectTrigger);
  const content = childrenArray.find((child: any) => child.type === SelectContent);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setIsOpen(!isOpen),
        isOpen
      })}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          {React.cloneElement(content as React.ReactElement, {
            onSelect: handleSelect,
            currentValue: value
          })}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ children, className = '', ...props }: SelectTriggerProps & { onClick?: () => void; isOpen?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between w-full p-2 border rounded-md cursor-pointer bg-[#2d3b4e] border-[#2d3b4e] text-white ${className}`}
      onClick={props.onClick}
    >
      {children}
      <ChevronDown 
        className={`size-4 transition-transform ${props.isOpen ? 'rotate-180' : ''}`} 
      />
    </div>
  );
}

export function SelectValue({ placeholder = "Select..." }: SelectValueProps) {
  return <span className="text-sm">{placeholder}</span>;
}

export function SelectContent({ children, className = '', ...props }: SelectContentProps & { onSelect?: (value: string) => void; currentValue?: string }) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        onSelect: props.onSelect,
        isSelected: child.props.value === props.currentValue
      });
    }
    return child;
  });

  return (
    <div className={`bg-[#2d3b4e] border border-[#3d4e65] rounded-md shadow-lg overflow-hidden ${className}`}>
      {childrenWithProps}
    </div>
  );
}

export function SelectItem({ value, children, className = '', ...props }: SelectItemProps & { onSelect?: (value: string) => void; isSelected?: boolean }) {
  const handleClick = () => {
    props.onSelect?.(value);
  };

  return (
    <div
      className={`px-3 py-2 text-sm text-white cursor-pointer transition-colors hover:bg-[#3d4e65] ${
        props.isSelected ? 'bg-[#f5a623] text-white' : ''
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}