# Linter配置

此样板使用ESLint作为linter，并使用标准预设与一些小的自定义。

如果你不满意默认的linting规则，你有几个选择：

- 1 覆盖中的各个规则.eslintrc.js。例如，您可以添加以下规则以强制使用分号，而不是省略它们：

  ``` js
  "semi": [2, "always"]
  ```
- 2 在生成项目时选择不同的ESLint预设，例如[eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

- 3 在生成项目并定义自己的规则时，为ESLint预设选择“无”。有关更多详细信息，请参阅[ESLint文档](http://eslint.org/docs/rules/)
