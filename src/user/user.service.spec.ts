import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../address/address.service';
import { Address } from '../address/interfaces/address.interface';
import { Repository } from 'typeorm';
import { User } from './interfaces/user.entity';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const usersList: User[] = [
  {
    "name": "Jorge",
    "phone": "+5524999273277",
    "CPF": "654.764.776-59",
    "CEP": "27215-500",
    "address": "Rua Quinhentos e Trinta e Nove-A",
    "city": "Volta Redonda",
    "state": "RJ",
    "created_at": new Date("2021-10-25T02:09:22.935Z"),
    "updated_at": new Date("2021-10-25T02:09:22.935Z")
  },
  {
    "name": "Leonardo",
    "phone": "+5524999000444",
    "CPF": "65476477659",
    "CEP": "77063-150",
    "address": "Quadra T 20 Rua LO 7",
    "city": "Palmas",
    "state": "TO",
    "created_at": new Date("2021-10-25T02:23:03.043Z"),
    "updated_at": new Date("2021-10-25T02:23:03.043Z")
  }
]

const addressInfo: Address = {
  "cep": "78556-556",
  "logradouro": "Rua Tom Jobim",
  "complemento": "de 470/471 a 887/888",
  "bairro": "Aquarela Brasil Residencial",
  "localidade": "Sinop",
  "uf": "MT",
  "ibge": "5107909",
  "gia": "",
  "ddd": "66",
  "siafi": "8985"
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(usersList),
            findOne: jest.fn().mockResolvedValue(usersList[0]),
            update: jest.fn().mockReturnValue(undefined),
            save: jest.fn().mockResolvedValue(usersList[0]),
            delete: jest.fn().mockReturnValue(undefined),
          }
        },
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            getAdressInfoByCEP: jest.fn().mockResolvedValue(addressInfo)
          }
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(AddressService).toBeDefined();
  });

  it('should return a list of users succesfully', async () => {
    const users = await userService.getAllUsers();

    expect(users).toEqual(usersList);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should throw an error at getAllUsers fail', async () => {
    jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

    expect(userService.getAllUsers()).rejects.toThrowError();
  })

  it('should return a single user info', async () => {
    const CPF = '25724252031'

    const user = await userService.getUserByCPF(CPF);

    expect(user).toEqual(usersList[0]);
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  it('should throw a not found exception because the user was not found', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue(undefined);

    const CPF = '25724252031';

    try {
      const user = await userService.getUserByCPF(CPF);
    } catch (error) {
      console.log()
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.statusCode).toEqual(404);
    }

  });

  it('should create new user succesfully', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue(undefined);
    addressService.getAdressInfoByCEP = jest.fn().mockResolvedValue(addressInfo);

    const user = await userService.createUser({
      name: "Leonardo",
      phone: "+5524999000442",
      CPF: "65476477659",
      CEP: "77063-150",
      address: "Quadra T 20 Rua LO 7",
      city: "Palmas",
      state: "TO",
    });

    expect(user).toEqual(usersList[0]);
    expect(userRepository.findOne).toHaveBeenCalledTimes(2);
    expect(addressService.getAdressInfoByCEP).toHaveBeenCalled();
  });

  it('should throw a bad request error because the phone number is already registered', async () => {
    try {
      const user = await userService.createUser({
        name: "Leonardo",
        phone: "+5524999000444",
        CPF: "65476477659",
        CEP: "77063-150",
        address: "Quadra T 20 Rua LO 7",
        city: "Palmas",
        state: "TO",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response.statusCode).toEqual(400);
    }
  });

  it('should return an error when update failed', async () => {
    jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error);

    const CPF = '25724252031';

    const updateUserDto = {
      name: "Marcos",
      phone: "+5524999000444",
      CEP: "77063-150",
      address: "Quadra T 20 Rua LO 7",
      city: "Rio de Janeiro",
      state: "RJ",
    }

    expect(userService.updateUser(CPF, updateUserDto)).rejects.toThrowError();
  });

  it('should throw a not found exception because there is no user to update with given CPF', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const CPF = '25724252031';

    const updateUserDto = {
      name: "Marcos",
      phone: "+5524999000444",
      CEP: "77063-150",
      address: "Quadra T 20 Rua LO 7",
      city: "Rio de Janeiro",
      state: "RJ",
    }

    try {
      const user = await userService.updateUser(CPF, updateUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.statusCode).toEqual(404);
    }
  });


  it('should delete a user succesfully', async () => {
    const CPF = '25724252031';

    const result = await userService.deleteUser(CPF);

    expect(result).toBeUndefined();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should return an error on failed deletion', async () => {
    jest.spyOn(userRepository, 'delete').mockRejectedValueOnce(new Error);

    const CPF = '25724252031';

    expect(userService.deleteUser(CPF)).rejects.toThrowError();
  });

  it('should throw a not found error because there is no user with given CPF', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const CPF = '25724252031';

    try {
      await userService.deleteUser(CPF) 
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response.statusCode).toEqual(404);
      expect(userRepository.findOne).toHaveBeenCalled();
    }
  });
});
