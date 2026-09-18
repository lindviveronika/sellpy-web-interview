import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Checkbox, TextField, Typography } from '@mui/material'

export const TodoItem = ({ number, name, completed, onNameChange, onDelete, onCompleteChange }) => {
  const handleNameChange = (event) => {
    onNameChange(event.target.value)
  }

  const handleCompleteChange = (event) => {
    onCompleteChange(event.target.checked)
  }

  const ariaName = name || `todo number ${number}`

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ margin: '8px' }} variant='h6'>
        {number}
      </Typography>
      <Checkbox
        inputProps={{ 'aria-label': ariaName }}
        checked={completed}
        onChange={handleCompleteChange}
      />
      <TextField
        sx={{ flexGrow: 1 }}
        label='What to do?'
        value={name}
        onChange={handleNameChange}
      />
      <Button
        sx={{ margin: '8px' }}
        size='small'
        color='secondary'
        onClick={onDelete}
        aria-label={`Delete ${ariaName}`}
      >
        <DeleteIcon />
      </Button>
    </div>
  )
}
