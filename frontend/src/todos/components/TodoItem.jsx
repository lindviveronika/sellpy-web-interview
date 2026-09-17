import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TextField, Typography } from '@mui/material'

export const TodoItem = ({ number, name, onNameChange, onDelete }) => {
  const handleNameChange = (event) => {
    onNameChange(event.target.value)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ margin: '8px' }} variant='h6'>
        {number}
      </Typography>
      <TextField
        sx={{ flexGrow: 1, marginTop: '1rem' }}
        label='What to do?'
        value={name}
        onChange={handleNameChange}
      />
      <Button sx={{ margin: '8px' }} size='small' color='secondary' onClick={onDelete}>
        <DeleteIcon />
      </Button>
    </div>
  )
}
