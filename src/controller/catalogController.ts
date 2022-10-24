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

import { Response, NextFunction } from 'express';
import { Request } from '../types/request-types';

export async function getProducts(req: Request, res: Response) {
  const { phone, qnt } = req.query;
  if (!phone)
    return res.status(401).send({
      message: 'Please send the contact number you wish to return the products.',
    });

  try {
    const result = await req.client?.getProducts(phone as string, qnt as unknown as number);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on get products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  const { phone, id } = req.query;
  if (!phone || !id)
    return res.status(401).send({
      message: 'Please send the contact number and productId.',
    });

  try {
    const result = await req.client?.getProductById(phone as string, id as string);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on get product' });
  }
}
export async function editProduct(req: Request, res: Response) {
  const { id, options } = req.body;
  if (!id || !options)
    return res.status(401).send({
      message: 'productId or options was not informed',
    });

  try {
    const result = await req.client?.editProduct(id, options);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on edit product.' });
  }
}

export async function delProducts(req: Request, res: Response) {
  const { id } = req.body;
  if (!id)
    return res.status(401).send({
      message: 'products Id was not informed',
    });

  try {
    const result = await req.client?.delProducts(id);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on delete product.' });
  }
}

export async function changeProductImage(req: Request, res: Response) {
  const { id, base64 } = req.body;
  if (!id || !base64)
    return res.status(401).send({
      message: 'productId and base64 was not informed',
    });

  try {
    const result = await req.client?.changeProductImage(id, base64);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on change product image.' });
  }
}

export async function addProductImage(req: Request, res: Response) {
  const { id, base64 } = req.body;
  if (!id || !base64)
    return res.status(401).send({
      message: 'productId and base64 was not informed',
    });

  try {
    const result = await req.client?.addProductImage(id, base64);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on add product image.' });
  }
}

export async function removeProductImage(req: Request, res: Response) {
  const { id, index } = req.body;
  if (!id || !index)
    return res.status(401).send({
      message: 'productId and index image was not informed',
    });

  try {
    const result = await req.client?.addProductImage(id, index);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on remove product image.' });
  }
}

export async function getCollections(req: Request, res: Response) {
  const { phone, qnt, max } = req.query;
  if (!phone)
    return res.status(401).send({
      message: 'phone was not informed',
    });

  try {
    const result = await req.client?.getCollections(phone as string, qnt as string, max as string);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on get collections.' });
  }
}

export async function createCollection(req: Request, res: Response) {
  const { name, products } = req.body;
  if (!name || !products)
    return res.status(401).send({
      message: 'name or products was not informed',
    });

  try {
    const result = await req.client?.createCollection(name, products);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on create collection.' });
  }
}

export async function editCollection(req: Request, res: Response) {
  const { id, options } = req.body;
  if (!id || !options)
    return res.status(401).send({
      message: 'id or options was not informed',
    });

  try {
    const result = await req.client?.createCollection(id, options);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on edit collection.' });
  }
}

export async function deleteCollection(req: Request, res: Response) {
  const { id } = req.body;
  if (!id)
    return res.status(401).send({
      message: 'id was not informed',
    });

  try {
    const result = await req.client?.deleteCollection(id);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on delete collection.' });
  }
}

export async function setProductVisibility(req: Request, res: Response) {
  const { id, value } = req.body;
  if (!id || !value)
    return res.status(401).send({
      message: 'product id or value (false, true) was not informed',
    });

  try {
    const result = await req.client?.setProductVisibility(id, value);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on set product visibility.' });
  }
}

export async function updateCartEnabled(req: Request, res: Response) {
  const { enabled } = req.body;
  if (!enabled)
    return res.status(401).send({
      message: 'enabled (false, true) was not informed',
    });

  try {
    const result = await req.client?.updateCartEnabled(enabled);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Error on set enabled cart.' });
  }
}
