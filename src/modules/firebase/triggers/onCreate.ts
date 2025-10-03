import * as functions from 'firebase-functions';

export const onCreateTest = functions.firestore
  .document('test/{id}')
  .onCreate((snapshot, _context) => {
    const value = snapshot.data();
    console.log('onCreate', { value });
  });
