import Input from '@/components/Input';
import { cn } from '@/utils/classNames';
import { formatForExperience } from '@/utils/index';
import { SetStateAction } from 'jotai';

export default function PercentageDifference({
  percentages,
  setPercentages,
  invalidInput,
  setIsInvalid,
}: {
  percentages: PercentageState;
  setPercentages: React.Dispatch<SetStateAction<PercentageState>>;
  invalidInput: boolean;
  setIsInvalid: React.Dispatch<SetStateAction<boolean>>;
}) {
  const handleInvalid = () => {
    if (
      percentages.initial &&
      percentages.final &&
      Number(percentages.initial) >= Number(percentages.final)
    ) {
      setIsInvalid(true);
      console.log('asdfsd');
    } else setIsInvalid(false);
  };

  return (
    <div
      className={cn(
        'my-16 flex w-full max-w-xs flex-col rounded-md border-2 border-transparent motion-safe:transition-colors',
        {
          ['border-red-400 bg-red-400/10']: invalidInput,
        }
      )}
    >
      <Input
        placeholder='Initial percentage'
        onChange={(value) =>
          setPercentages((prev) => ({
            ...prev,
            initial: formatForExperience(value),
          }))
        }
        value={percentages.initial}
        suffix='%'
        onBlur={handleInvalid}
      />
      <Input
        className={cn(
          'border-t-2 border-primary-400 bg-transparent bg-input-top-to-bottom motion-safe:transition-colors',
          { ['border-red-400']: invalidInput }
        )}
        suffix='%'
        placeholder='Percentage after the timer'
        onChange={(value) =>
          setPercentages((prev) => ({
            ...prev,
            final: formatForExperience(value),
          }))
        }
        value={percentages.final}
        onBlur={handleInvalid}
      />
    </div>
  );
}
