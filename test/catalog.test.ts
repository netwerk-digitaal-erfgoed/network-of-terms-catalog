import {Catalog, Dataset, fromFiles, IRI} from '../src/catalog';

let catalog: Catalog;

describe('Catalog', () => {
  beforeAll(async () => {
    catalog = await Catalog.default();
  });

  it('can be created from files', async done => {
    const store = await fromFiles('catalog/');
    const catalog = await Catalog.fromStore(store);
    expect(catalog.datasets.length).toBe(6);
    expect(catalog.datasets[0].distributions[0].query).toEqual(
      expect.stringContaining('CONSTRUCT {')
    );
    done();
  });

  it('can list datasets', () => {
    expect(catalog.datasets.length).toBe(6);
  });

  it('can retrieve datasets by identifier', () => {
    expect(
      catalog.getByDistributionIri(new IRI('https://nope.com'))
    ).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    const cht = catalog.getByDistributionIri(
      new IRI('https://data.cultureelerfgoed.nl/PoolParty/sparql/term/id/cht')
    )!!;
    expect(cht).toBeInstanceOf(Dataset);
    expect(cht.name).toEqual('Cultuurhistorische Thesaurus (CHT)');
  });
});
