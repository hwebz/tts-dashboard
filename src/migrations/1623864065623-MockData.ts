import { MigrationInterface, QueryRunner } from 'typeorm';

const QUERY_INSERT_TABLE_HOTEL = `
INSERT INTO
  hotel (name) 
VALUES
  (
    'Raj Palace Hotel'
  )
, 
  (
    'Laucala Island Resort Hilltop Estate'
  )
, 
  (
    'Burj Al Arab'
  )
, 
  (
    'Hotel Plaza Athenèe'
  )
, 
  (
    'Palms Casino Resort'
  )
, 
  (
    'Grand Resort Lagonissi Royal Villa'
  )
, 
  (
    'Four Seasons Hotel'
  )
, 
  (
    'Hotel President Wilson Royal Penthouse Suite'
  )
, 
  (
    'Lovers Deep Luxury Submarine'
  )
,
  ('Grand Hyatt Cannes Hotel');
`;
const QUERY_INSERT_TABLE_REVIEW = `
INSERT INTO
  review (hotel_id, score, COMMENT, created_date) WITH expanded AS 
  (
    SELECT
      RANDOM(),
      seq,
      h.id AS hotel_id 
    FROM
      GENERATE_SERIES(1, 50000) seq,
      hotel h 
  )
,
  shuffled AS 
  (
    SELECT
      e.* 
    FROM
      expanded e 
      INNER JOIN
        (
          SELECT
            ei.seq,
            MIN(ei.random) 
          FROM
            expanded ei 
          GROUP BY
            ei.seq 
        )
        em 
        ON (e.seq = em.seq 
        AND e.random = em.min) 
    ORDER BY
      e.seq 
  )
  SELECT
    s.hotel_id,
    ROUND(RANDOM() * 99 + 1) AS score,
    'The ' || ( 
    CASE
(RANDOM() * 2)::INT 
      WHEN
        0 
      THEN
        'service' 
      WHEN
        1 
      THEN
        'food' 
      WHEN
        2 
      THEN
        'room' 
    END
) || ' is ' || ( 
    CASE
(RANDOM() * 2)::INT 
      WHEN
        0 
      THEN
        'good' 
      WHEN
        1 
      THEN
        'average' 
      WHEN
        2 
      THEN
        'bad' 
    END
) AS COMMENT, DATE(now() - random() * INTERVAL '2 years') AS created_date 
  FROM
    shuffled s;
`;
const CREATE_INDEX_TABLE_REVIEW = `CREATE INDEX review_hotelId_createdDate ON review (hotel_id, created_date);`;
const QUERY_DROP_TABLE_HOTEL = `DROP TABLE IF EXISTS hotel`;
const QUERY_DROP_TABLE_REVIEW = `DROP TABLE IF EXISTS review`;

export class MockData1623864065623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(QUERY_INSERT_TABLE_HOTEL);
    await queryRunner.query(QUERY_INSERT_TABLE_REVIEW);
    await queryRunner.query(CREATE_INDEX_TABLE_REVIEW);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
