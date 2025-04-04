import { TextField } from '@mui/material';
import { validateNumberForTextField } from '../../util/validateNumber';

function NumberInput({ label, onChange, value, min, max, ...param }) {
  return (
    <TextField
      label={label}
      type="number"
      variant="outlined"
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (
          validateNumberForTextField({ min, max, value: event.target.value, event, key: event.key })
        ) {
          event.preventDefault();
        }
      }}
      {...param}
    />
  )
}

export default NumberInput