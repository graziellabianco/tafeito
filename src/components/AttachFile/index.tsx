import React, { useEffect } from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAxios } from '../../hooks/useAxios';

import { Anexo } from '../../common/types';

import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

type AttachFileProps = {
  anexo: Anexo;
  taskId: number;
  anexoId: number;
}

type ResponseGetAttachedFile = Blob;

type ResponseDeleteAnexo = {

}

const AttachFile = (props: AttachFileProps) => {
  const { taskId, anexo } = props;

  const {
    commit: commitDownloadAnexo,
    response,
    loading
  } = useAxios<ResponseGetAttachedFile>({
    method: 'GET',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  useEffect(() => {
    if (response && !loading) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', anexo.nome);
      document.body.appendChild(link);
      link.click();
    }
  }, [response, loading]);

  const downloadAnexo = () => {
    commitDownloadAnexo(
      undefined,
      undefined,
      undefined,
      'blob'
    );
  };

  const {
    commit: commitAnexo,
    response: anexoId,
  } = useAxios<ResponseDeleteAnexo>({
    method: 'DELETE',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  const deleteAnexo = (anexoId: number) => {
    commitAnexo({}, undefined, `tarefas/${taskId}/anexos/${anexo.id}`)
  }

  return (
    <ListItemButton sx={{ pl: 4 }} onClick={() => { downloadAnexo() }}>
      <ListItemText primary={anexo.nome} />
      <Tooltip title='Excluir Anexo'>
        <IconButton edge="start" aria-label="excluir" onClick={() => { deleteAnexo(anexo.id) }}>
          <Delete />
        </IconButton>
      </Tooltip>
    </ListItemButton>
  )
}

export default AttachFile;