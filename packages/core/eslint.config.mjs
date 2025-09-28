import cleanArchitectureConfig from '@ecommerce/eslint-config/clean-architecture'
import nodeConfig from '@ecommerce/eslint-config/node'

export default [...nodeConfig, ...cleanArchitectureConfig]
