import { WatchtimeService } from './watchtime.service';

jest.mock('./schema/watchtime.schema', () => ({
  WatchTime: { name: 'WatchTime' },
}));

jest.mock('../movies/schema/movies.schema', () => ({
  Movies: { name: 'Movies' },
}));

describe('WatchtimeService', () => {
  let service: WatchtimeService;

  beforeEach(() => {
    service = new WatchtimeService(
      { findOneAndUpdate: jest.fn(), find: jest.fn() } as any,
      { findOne: jest.fn() } as any,
      { find: jest.fn() } as any,
      { getSignedStreamingUrl: jest.fn().mockReturnValue('https://signed.example.com/image.jpg') } as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty continue watching data for an invalid user id', async () => {
    const watchtimeModel = {
      find: jest.fn().mockResolvedValue([]),
    };

    service = new WatchtimeService(
      watchtimeModel as any,
      { findOne: jest.fn() } as any,
      { find: jest.fn() } as any,
      { getSignedStreamingUrl: jest.fn().mockReturnValue('https://signed.example.com/image.jpg') } as any,
    );

    const result = await service.getContinueWatching('not-a-valid-object-id');

    expect(result).toEqual({
      history: [],
      inProgress: [],
      watchedMoviesCount: 0,
      inProgressMoviesCount: 0,
    });
    expect(watchtimeModel.find).not.toHaveBeenCalled();
  });

  it('should enrich continue watching records with progress, status, and signed media urls', async () => {
    const watchtimeModel = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([
              {
                _id: 'watch-id',
                watchTime: 60,
                movie: {
                  _id: 'movie-id',
                  title: 'Sample Movie',
                  duration: 120,
                  category: { _id: 'cat-id', name: 'Drama' },
                  thumnailimage: { _id: 'thumb-id', key: 'thumb-key' },
                  posterimage: { _id: 'poster-id', key: 'poster-key' },
                },
              },
            ]),
          }),
        }),
      }),
    };

    const uploadedDocModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      }),
    };

    service = new WatchtimeService(
      watchtimeModel as any,
      { findOne: jest.fn() } as any,
      uploadedDocModel as any,
      { getSignedStreamingUrl: jest.fn().mockReturnValue('https://signed.example.com/image.jpg') } as any,
    );

    const result = await service.getContinueWatching('6865c7b8c2f0b2f4a7f6c112');

    expect(result.inProgress).toHaveLength(1);
    expect(result.inProgress[0]).toMatchObject({
      progressPercentage: 50,
      remainingTime: 60,
      completed: false,
      status: 'in-progress',
    });
    expect(result.inProgress[0].movie.thumnailimage.signedUrl).toBe('https://signed.example.com/image.jpg');
    expect(result.inProgress[0].movie.posterimage.signedUrl).toBe('https://signed.example.com/image.jpg');
  });
});
