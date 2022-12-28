// WARNING : Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import 'reflect-metadata';
import 'module-alias/register';
import { Server } from '@app/server';
import { Container } from 'typedi';

const server: Server = Container.get(Server);
server.init();
