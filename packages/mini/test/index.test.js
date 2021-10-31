const _ = require('./utils')

test('render', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {prop: 'index.test.properties'})

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  expect(_.match(component.dom, '<wx-view class="comp--index comp--other">index.test.properties-false</wx-view><other><wx-view class="other--index other--other">other.properties-other</wx-view></other>')).toBe(true)

  await _.sleep(10)

  expect(_.match(component.dom, '<wx-view class="comp--index comp--other">index.test.properties-true</wx-view><other><wx-view class="other--index other--other">other.properties-other</wx-view></other>')).toBe(true)  
})
