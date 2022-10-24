/*
 * Copyright 2022 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { unlinkAsync } from '../util/functions';
import { Response } from 'express';
import { Request } from '../types/request-types';

function returnError(req: Request, res: Response, error: any) {
  req.logger.error(error);
  res.status(500).json({ status: 'Error', message: 'Erro ao enviar a mensagem.' });
}

async function returnSucess(res: Response, data: any) {
  res.status(201).json({ status: 'success', response: data, mapper: 'return' });
}

export async function sendMessage(req: Request, res: Response) {
  const { phone, message } = req.body;

  const options = req.body.options || {};

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendText(contato, message, options));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    req.io.emit('mensagem-enviada', results);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendImage(req: Request, res: Response) {
  const { phone, filename = 'image-api.jpg', caption, path } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file?.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendImage(contato, pathFile, filename, caption));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendFile(req: Request, res: Response) {
  const { phone, path, filename = 'file', message } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file?.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendFile(contato, pathFile, filename, message));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendFile64(req: Request, res: Response) {
  const { base64, phone, filename } = req.body;

  if (!base64) return res.status(401).send({ message: 'The base64 of the file was not informed' });

  const options = req.body.options || {};

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendFile(contato, base64, Object.keys(options).length > 0 ? options : filename));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendVoice(req: Request, res: Response) {
  const { phone, path, filename = 'Voice Audio', message, quotedMessageId } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendPtt(contato, path, filename, message, quotedMessageId));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendVoice64(req: Request, res: Response) {
  const { phone, base64Ptt } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendPttFromBase64(contato, base64Ptt, 'Voice Audio'));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendLinkPreview(req: Request, res: Response) {
  const { phone, url, caption } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendLinkPreview(`${contato}`, url, caption));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendLocation(req: Request, res: Response) {
  const { phone, lat, lng, title } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendLocation(contato, lat, lng, title));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendButtons(req: Request, res: Response) {
  const { phone, message, options } = req.body;

  try {
    let results = [];

    for (const contact of phone) {
      results.push(await req.client?.sendText(contact, message, options));
    }

    if (results.length === 0) return returnError(req, res, 'Error sending message with buttons');

    returnSucess(res, phone);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendListMessage(req: Request, res: Response) {
  const { phone, description = '', sections, buttonText = 'SELECIONE UMA OPÇÃO' } = req.body;

  try {
    let results = [];

    for (const contact of phone) {
      results.push(
        await req.client?.sendListMessage(contact, {
          buttonText: buttonText,
          description: description,
          sections: sections,
        })
      );
    }

    if (results.length === 0) return returnError(req, res, 'Error sending list buttons');

    returnSucess(res, phone);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendPollMessage(req: Request, res: Response) {
  const { phone, name, choices, options } = req.body;

  try {
    let results = [];

    for (const contact of phone) {
      //results.push(await req.client?.sendPollMessage(contact, name, choices, options));
    }

    if (results.length === 0) return returnError(req, res, 'Error sending poll message');

    returnSucess(res, '');
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendStatusText(req: Request, res: Response) {
  const { message } = req.body;

  try {
    let results = [];
    results.push(await req.client?.sendText('status@broadcast', message));

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function replyMessage(req: Request, res: Response) {
  const { phone, message, messageId } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.reply(contato, message, messageId));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    req.io.emit('mensagem-enviada', { message: message, to: phone });
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendMentioned(req: Request, res: Response) {
  const { phone, message, mentioned } = req.body;

  try {
    let response;
    for (const contato of phone) {
      response = await req.client?.sendMentioned(`${contato}`, message, mentioned);
    }

    return res.status(201).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on send message mentioned' });
  }
}
export async function sendImageAsSticker(req: Request, res: Response) {
  const { phone, path } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file?.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendImageAsSticker(contato, pathFile));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
export async function sendImageAsStickerGif(req: Request, res: Response) {
  const { phone, path } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file?.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client?.sendImageAsStickerGif(contato, pathFile));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
