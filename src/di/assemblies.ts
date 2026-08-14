import { apiClient } from '../core/apiClient';
import { PokemonRemoteDataSourceImpl } from '../data/datasources/PokemonRemoteDataSource';
import { PokemonLocalDataSourceImpl } from '../data/datasources/PokemonLocalDataSource';
import { PokemonRepositoryImpl } from '../data/repositories/PokemonRepositoryImpl';
import { GetPokemonDetailUseCaseImpl } from '../domain/usecases/GetPokemonDetailUseCase';
import { GetPokemonListUseCaseImpl } from '../domain/usecases/GetPokemonListUseCase';
import { Container } from './Container';
import { Tokens } from './tokens';

// Equivalente a NetworkAssembly + DataAssembly de Swinject.
function registerNetworkAndData(container: Container): void {
  container.register(Tokens.ApiClient, () => apiClient, { singleton: true });

  container.register(
    Tokens.PokemonRemoteDataSource,
    c => new PokemonRemoteDataSourceImpl(c.resolve(Tokens.ApiClient)),
    { singleton: true },
  );

  container.register(Tokens.PokemonLocalDataSource, () => new PokemonLocalDataSourceImpl(), {
    singleton: true,
  });

  container.register(
    Tokens.PokemonRepository,
    c =>
      new PokemonRepositoryImpl(
        c.resolve(Tokens.PokemonRemoteDataSource),
        c.resolve(Tokens.PokemonLocalDataSource),
      ),
    { singleton: true },
  );
}

// Equivalente a DomainAssembly de Swinject.
function registerDomain(container: Container): void {
  container.register(
    Tokens.GetPokemonListUseCase,
    c => new GetPokemonListUseCaseImpl(c.resolve(Tokens.PokemonRepository)),
  );

  container.register(
    Tokens.GetPokemonDetailUseCase,
    c => new GetPokemonDetailUseCaseImpl(c.resolve(Tokens.PokemonRepository)),
  );
}

// Equivalente a AppAssembler.resolver: combina todas las assemblies en un único container.
export function buildContainer(): Container {
  const container = new Container();
  registerNetworkAndData(container);
  registerDomain(container);
  return container;
}
