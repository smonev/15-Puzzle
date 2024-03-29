import TestUtils from 'react/lib/ReactTestUtils';
import matchers from 'react-jasmine-matchers';


const testsContext = require.context('.', true, /\-spec\.js$/);
testsContext.keys().forEach(testsContext);


beforeEach(function () {
  jasmine.addMatchers(matchers(TestUtils));
});
