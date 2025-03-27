// Path: src/data/courses.js
export const courses = [
    {
      id: 'python-fundamentals',
      title: 'Python Fundamentals',
      description: 'Learn the basics of Python programming language, from variables and data types to functions and object-oriented programming.',
      thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/courses%2Fpython-fundamentals.jpg?alt=media',
      category: 'python',
      level: 'beginner',
      duration: '10 hours',
      isPremium: false,
      learningPoints: [
        'Understand Python syntax and basic programming concepts',
        'Work with variables, data types, and control structures',
        'Create and use functions, modules, and packages',
        'Learn object-oriented programming with Python',
        'Handle errors and exceptions in your code'
      ],
      requirements: [
        'No prior programming experience required',
        'A computer with internet access',
        'Enthusiasm to learn programming'
      ],
      instructor: {
        name: 'Dr. Sarah Johnson',
        title: 'Python Expert & Computer Science Professor',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/instructors%2Fsarah-johnson.jpg?alt=media',
        bio: 'Dr. Sarah Johnson has over 15 years of experience teaching Python programming. She holds a Ph.D. in Computer Science and has authored several books on programming.'
      },
      lessons: [
        {
          id: 'python-intro',
          title: 'Introduction to Python',
          duration: '45 min',
          content: [
            {
              id: 'what-is-python',
              title: 'What is Python?',
              type: 'text',
              description: 'Python is a high-level, interpreted programming language known for its readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has since become one of the most popular programming languages in the world. It\'s widely used in web development, data analysis, artificial intelligence, scientific computing, and many other fields.'
            },
            {
              id: 'python-features',
              title: 'Key Features of Python',
              type: 'text',
              description: 'Python has several key features that make it an excellent choice for beginners and experienced programmers alike:\n\n- Simple, easy-to-learn syntax\n- Interpreted language (no need to compile)\n- Dynamically typed (no need to declare variable types)\n- Object-oriented programming support\n- Rich standard library\n- Extensive third-party modules\n- Cross-platform compatibility\n- Strong community support'
            },
            {
              id: 'python-installation',
              title: 'Installing Python',
              type: 'video',
              videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fpython-installation.mp4?alt=media',
              description: 'In this video, we\'ll walk through the process of installing Python on different operating systems.'
            }
          ],
          exercises: [
            {
              id: 'hello-world',
              title: 'Hello, World!',
              description: 'Let\'s write your first Python program! Create a program that prints "Hello, World!" to the console.',
              instructions: 'Use the print() function to display the text "Hello, World!" (including the quotes).',
              starterCode: '# Write your code below\n\n',
              solution: 'print("Hello, World!")',
              hint: 'The print() function is used to output text to the console. Don\'t forget to use quotes around the text.',
              completed: false
            }
          ]
        },
        {
          id: 'variables-data-types',
          title: 'Variables and Data Types',
          duration: '60 min',
          content: [
            {
              id: 'variables',
              title: 'Variables in Python',
              type: 'text',
              description: 'Variables are used to store data that can be used and manipulated throughout your program. In Python, you don\'t need to declare a variable\'s type; just assign a value to it.'
            },
            {
              id: 'variable-naming',
              title: 'Variable Naming Rules',
              type: 'text',
              description: 'When naming variables in Python, follow these rules:\n\n- Variable names can contain letters, numbers, and underscores\n- Variable names must start with a letter or underscore\n- Variable names are case-sensitive (age, Age, and AGE are different variables)\n- Variable names cannot be Python keywords (like if, for, class, etc.)'
            },
            {
              id: 'data-types',
              title: 'Basic Data Types',
              type: 'video',
              videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fpython-data-types.mp4?alt=media',
              description: 'This video covers the basic data types in Python: integers, floats, strings, and booleans.'
            },
            {
              id: 'data-type-examples',
              title: 'Data Type Examples',
              type: 'code',
              language: 'python',
              code: '# Integer (whole number)\nage = 25\nprint(f"Age: {age}, Type: {type(age)}")\n\n# Float (decimal number)\nheight = 5.9\nprint(f"Height: {height}, Type: {type(height)}")\n\n# String (text)\nname = "John Doe"\nprint(f"Name: {name}, Type: {type(name)}")\n\n# Boolean (True/False)\nis_student = True\nprint(f"Is Student: {is_student}, Type: {type(is_student)}")'
            }
          ],
          exercises: [
            {
              id: 'variable-assignment',
              title: 'Variable Assignment',
              description: 'Practice creating variables of different types and performing operations with them.',
              instructions: 'Create three variables: an integer named "age" with value 25, a float named "temperature" with value 98.6, and a string named "greeting" with value "Hello, Python!". Then print each variable.',
              starterCode: '# Create your variables below\n\n\n# Print the variables\n',
              solution: 'age = 25\ntemperature = 98.6\ngreeting = "Hello, Python!"\n\nprint(age)\nprint(temperature)\nprint(greeting)',
              hint: 'Assign values to variables using the equals sign. Integer values don\'t need quotes, float values use decimal points, and strings need quotes.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 'intro-to-machine-learning',
      title: 'Introduction to Machine Learning with Python',
      description: 'Dive into the fascinating world of machine learning using Python. Learn the fundamentals of ML algorithms, data preprocessing, model training, and evaluation.',
      thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/courses%2Fmachine-learning.jpg?alt=media',
      category: 'ai',
      level: 'intermediate',
      duration: '15 hours',
      isPremium: true,
      learningPoints: [
        'Understand the core concepts of machine learning',
        'Preprocess and prepare data for modeling',
        'Implement supervised learning algorithms',
        'Evaluate and improve model performance',
        'Build real-world machine learning applications'
      ],
      requirements: [
        'Basic Python programming knowledge',
        'Understanding of fundamental mathematics (algebra, statistics)',
        'A computer with Python installed',
        'Enthusiasm for AI and data science'
      ],
      instructor: {
        name: 'Dr. Michael Chen',
        title: 'AI Researcher & Data Scientist',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/instructors%2Fmichael-chen.jpg?alt=media',
        bio: 'Dr. Chen has worked on machine learning projects at top tech companies and research institutions. He specializes in making complex ML concepts accessible to beginners.'
      },
      lessons: [
        {
          id: 'ml-fundamentals',
          title: 'Machine Learning Fundamentals',
          duration: '60 min',
          content: [
            {
              id: 'what-is-ml',
              title: 'What is Machine Learning?',
              type: 'text',
              description: 'Machine Learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed. Instead of writing rules manually, ML algorithms find patterns in data and build models that can make predictions or decisions.'
            },
            {
              id: 'ml-types',
              title: 'Types of Machine Learning',
              type: 'video',
              videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fml-types.mp4?alt=media',
              description: 'This video explains the three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.'
            },
            {
              id: 'ml-workflow',
              title: 'Machine Learning Workflow',
              type: 'text',
              description: 'A typical machine learning project follows these steps:\n\n1. Define the problem\n2. Collect and prepare data\n3. Choose a model\n4. Train the model\n5. Evaluate the model\n6. Fine-tune the model\n7. Deploy the model\n8. Monitor and update'
            }
          ],
          exercises: [
            {
              id: 'ml-concepts',
              title: 'Machine Learning Concepts',
              description: 'Test your understanding of basic machine learning concepts.',
              instructions: 'Complete the function that returns the correct type of machine learning based on the description.',
              starterCode: 'def identify_ml_type(description):\n    \"""Returns the type of machine learning based on the description.\n    Types: \'supervised\', \'unsupervised\', or \'reinforcement\'\n    \"""\n    # Your code here\n    pass\n\n# Test cases\nprint(identify_ml_type("Learning from labeled data to make predictions"))\nprint(identify_ml_type("Finding patterns in unlabeled data"))\nprint(identify_ml_type("Learning through trial and error with rewards"))',
              solution: 'def identify_ml_type(description):\n    \"""Returns the type of machine learning based on the description.\n    Types: \'supervised\', \'unsupervised\', or \'reinforcement\'\n    \"""\n    if "labeled" in description.lower():\n        return "supervised"\n    elif "unlabeled" in description.lower() or "patterns" in description.lower():\n        return "unsupervised"\n    elif "reward" in description.lower() or "trial and error" in description.lower():\n        return "reinforcement"\n    else:\n        return "unknown"',
              hint: 'Supervised learning uses labeled data, unsupervised learning finds patterns in unlabeled data, and reinforcement learning involves rewards and trial-and-error.',
              completed: false
            }
          ]
        },
        {
          id: 'data-preprocessing',
          title: 'Data Preprocessing for ML',
          duration: '75 min',
          content: [
            {
              id: 'importance-preprocessing',
              title: 'Importance of Data Preprocessing',
              type: 'text',
              description: 'Data preprocessing is a crucial step in any machine learning project. Raw data is often incomplete, inconsistent, and contains errors. Proper preprocessing ensures your models receive quality data, leading to better results.'
            },
            {
              id: 'common-techniques',
              title: 'Common Preprocessing Techniques',
              type: 'video',
              videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fdata-preprocessing.mp4?alt=media',
              description: 'This video covers common data preprocessing techniques including handling missing values, feature scaling, encoding categorical variables, and feature selection.'
            },
            {
              id: 'preprocessing-code',
              title: 'Data Preprocessing with Scikit-learn',
              type: 'code',
              language: 'python',
              code: 'import numpy as np\nimport pandas as pd\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\n\n# Sample data\ndata = {\n    \'age\': [25, 30, np.nan, 22, 35],\n    \'income\': [50000, 60000, 75000, np.nan, 80000],\n    \'gender\': [\'F\', \'M\', \'F\', \'M\', \'F\'],\n    \'country\': [\'US\', \'UK\', \'US\', \'UK\', \'CA\']\n}\n\ndf = pd.DataFrame(data)\nprint("Original data:\\n", df)\n\n# Handle missing numerical values\nnum_imputer = SimpleImputer(strategy=\'mean\')\ndf[[\'age\', \'income\']] = num_imputer.fit_transform(df[[\'age\', \'income\']])\n\n# Scale numerical features\nscaler = StandardScaler()\ndf[[\'age\', \'income\']] = scaler.fit_transform(df[[\'age\', \'income\']])\n\n# Encode categorical variables\nencoder = OneHotEncoder(sparse=False)\ncategorical_encoded = encoder.fit_transform(df[[\'gender\', \'country\']])\ncategorical_cols = encoder.get_feature_names_out([\'gender\', \'country\'])\n\n# Create new DataFrame with processed data\nencoded_df = pd.DataFrame(categorical_encoded, columns=categorical_cols, index=df.index)\nfinal_df = pd.concat([df[[\'age\', \'income\']], encoded_df], axis=1)\n\nprint("\\nProcessed data:\\n", final_df)'
            }
          ],
          exercises: [
            {
              id: 'missing-values',
              title: 'Handling Missing Values',
              description: 'Practice handling missing values in a dataset using pandas and scikit-learn.',
              instructions: 'Complete the function to handle missing values in the given DataFrame. For numerical columns, replace missing values with the median. For categorical columns, replace missing values with the most frequent value.',
              starterCode: 'import pandas as pd\nfrom sklearn.impute import SimpleImputer\n\ndef handle_missing_values(df):\n    """Handles missing values in a DataFrame.\n    \n    Args:\n        df: pandas DataFrame with missing values\n        \n    Returns:\n        pandas DataFrame with missing values handled\n    """\n    # Your code here\n    return df\n\n# Test the function\ndata = {\n    \'age\': [25, 30, None, 22, 35],\n    \'income\': [50000, 60000, 75000, None, 80000],\n    \'education\': [\'Bachelor\', None, \'Master\', \'Bachelor\', \'PhD\'],\n    \'city\': [\'New York\', \'Boston\', None, \'Chicago\', \'New York\']\n}\n\ndf = pd.DataFrame(data)\nprint("Original data:\\n", df)\nprocessed_df = handle_missing_values(df)\nprint("\\nProcessed data:\\n", processed_df)',
              solution: 'import pandas as pd\nfrom sklearn.impute import SimpleImputer\n\ndef handle_missing_values(df):\n    """Handles missing values in a DataFrame.\n    \n    Args:\n        df: pandas DataFrame with missing values\n        \n    Returns:\n        pandas DataFrame with missing values handled\n    """\n    # Create a copy of the DataFrame\n    df_processed = df.copy()\n    \n    # Identify numerical and categorical columns\n    numerical_cols = df.select_dtypes(include=[\'int\', \'float\']).columns\n    categorical_cols = df.select_dtypes(include=[\'object\']).columns\n    \n    # Handle missing values in numerical columns using median\n    if len(numerical_cols) > 0:\n        num_imputer = SimpleImputer(strategy=\'median\')\n        df_processed[numerical_cols] = num_imputer.fit_transform(df[numerical_cols])\n    \n    # Handle missing values in categorical columns using most frequent value\n    if len(categorical_cols) > 0:\n        cat_imputer = SimpleImputer(strategy=\'most_frequent\')\n        df_processed[categorical_cols] = cat_imputer.fit_transform(df[categorical_cols])\n    \n    return df_processed',
              hint: 'Use SimpleImputer with strategy="median" for numerical columns and strategy="most_frequent" for categorical columns. First, identify which columns are numerical and which are categorical using df.select_dtypes().',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 'data-visualization-python',
      title: 'Data Visualization with Python',
      description: 'Learn how to create stunning visualizations to communicate insights from your data using Python libraries like Matplotlib, Seaborn, and Plotly.',
      thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/courses%2Fdata-visualization.jpg?alt=media',
      category: 'data-science',
      level: 'intermediate',
      duration: '12 hours',
      isPremium: true,
      learningPoints: [
        'Master fundamental visualization techniques',
        'Create various types of plots and charts',
        'Customize visualizations for better communication',
        'Build interactive dashboards',
        'Tell compelling stories with data'
      ],
      requirements: [
        'Basic Python programming knowledge',
        'Familiarity with pandas and NumPy',
        'Understanding of basic data analysis concepts',
        'A computer with Python installed'
      ],
      instructor: {
        name: 'Emma Rodriguez',
      title: 'Data Visualization Expert',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/instructors%2Femma-rodriguez.jpg?alt=media',
      bio: 'Emma has worked as a data visualization specialist for major tech companies and news organizations. She focuses on creating clear, informative, and visually appealing data representations.'
    },
    lessons: [
      {
        id: 'viz-fundamentals',
        title: 'Visualization Fundamentals',
        duration: '60 min',
        content: [
          {
            id: 'why-visualize',
            title: 'Why Visualize Data?',
            type: 'text',
            description: 'Data visualization translates complex data into graphical representations, making it easier to identify patterns, trends, and outliers. Good visualizations help tell stories with data, communicate insights effectively, and support decision-making processes.'
          },
          {
            id: 'visualization-types',
            title: 'Types of Visualizations',
            type: 'video',
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fvisualization-types.mp4?alt=media',
            description: 'This video covers common types of data visualizations and when to use each one, including bar charts, line charts, scatter plots, pie charts, and more.'
          },
          {
            id: 'visualization-principles',
            title: 'Principles of Effective Visualization',
            type: 'text',
            description: 'To create effective visualizations, follow these principles:\n\n- Show the data: Focus on the data, not fancy decorations\n- Avoid distorting the data: Represent quantities proportionally\n- Make large data sets coherent: Reveal patterns and insights\n- Encourage comparisons: Arrange data to facilitate comparisons\n- Provide context: Help viewers understand the significance\n- Choose appropriate visualization types for your data and message'
          }
        ],
        exercises: [
          {
            id: 'choosing-visualizations',
            title: 'Choosing the Right Visualization',
            description: 'Practice selecting appropriate visualization types for different datasets and analysis goals.',
            instructions: 'Complete the function that recommends visualization types based on the data characteristics and analysis goals.',
            starterCode: 'def recommend_visualization(data_type, relationship_type, num_variables):\n    """\n    Recommends visualization types based on data characteristics.\n    \n    Args:\n        data_type: \'numeric\', \'categorical\', or \'time-series\'\n        relationship_type: \'comparison\', \'distribution\', \'composition\', \'correlation\'\n        num_variables: Number of variables to visualize (1-3)\n        \n    Returns:\n        List of recommended visualization types\n    """\n    # Your code here\n    pass\n\n# Test cases\nprint(recommend_visualization(\'numeric\', \'distribution\', 1))\nprint(recommend_visualization(\'categorical\', \'comparison\', 2))\nprint(recommend_visualization(\'numeric\', \'correlation\', 2))',
            solution: 'def recommend_visualization(data_type, relationship_type, num_variables):\n    """\n    Recommends visualization types based on data characteristics.\n    \n    Args:\n        data_type: \'numeric\', \'categorical\', or \'time-series\'\n        relationship_type: \'comparison\', \'distribution\', \'composition\', \'correlation\'\n        num_variables: Number of variables to visualize (1-3)\n        \n    Returns:\n        List of recommended visualization types\n    """\n    recommendations = []\n    \n    if data_type == \'numeric\':\n        if relationship_type == \'distribution\':\n            recommendations.extend([\'histogram\', \'density plot\', \'box plot\'])\n        elif relationship_type == \'comparison\':\n            if num_variables == 1:\n                recommendations.extend([\'bar chart\', \'dot plot\'])\n            else:\n                recommendations.extend([\'grouped bar chart\', \'box plot\'])\n        elif relationship_type == \'correlation\':\n            recommendations.extend([\'scatter plot\', \'heatmap\'])\n    \n    elif data_type == \'categorical\':\n        if relationship_type == \'comparison\':\n            recommendations.extend([\'bar chart\', \'dot plot\'])\n        elif relationship_type == \'composition\':\n            recommendations.extend([\'pie chart\', \'stacked bar chart\'])\n    \n    elif data_type == \'time-series\':\n        recommendations.extend([\'line chart\', \'area chart\'])\n        if relationship_type == \'comparison\':\n            recommendations.append(\'multiple line chart\')\n    \n    return recommendations',
            hint: 'Different visualization types are appropriate for different data types and analysis goals. For example, histograms are good for numeric distributions, bar charts for categorical comparisons, and scatter plots for correlations between numeric variables.',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'python-web-development',
    title: 'Python Web Development with Flask',
    description: 'Learn how to build dynamic web applications using Python and the Flask web framework. Master routing, templates, forms, and database integration.',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/courses%2Fweb-development.jpg?alt=media',
    category: 'web',
    level: 'intermediate',
    duration: '18 hours',
    isPremium: false,
    learningPoints: [
      'Build web applications with Flask',
      'Create dynamic templates with Jinja2',
      'Handle forms and user input',
      'Integrate with databases using SQLAlchemy',
      'Deploy your web application'
    ],
    requirements: [
      'Basic Python programming knowledge',
      'Familiarity with HTML and CSS',
      'Understanding of basic web concepts',
      'A computer with Python installed'
    ],
    instructor: {
      name: 'Alex Turner',
      title: 'Full-Stack Developer & Instructor',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/instructors%2Falex-turner.jpg?alt=media',
      bio: 'Alex has been developing web applications for over 10 years and teaching programming for 5 years. He specializes in Python backend development and loves helping new developers build their first web applications.'
    },
    lessons: [
      {
        id: 'flask-intro',
        title: 'Introduction to Flask',
        duration: '55 min',
        content: [
          {
            id: 'what-is-flask',
            title: 'What is Flask?',
            type: 'text',
            description: 'Flask is a lightweight, micro web framework for Python. Unlike larger frameworks like Django, Flask provides only the essential components for web development, allowing you to choose and integrate additional tools as needed. This makes Flask flexible, easy to learn, and perfect for small to medium-sized applications.'
          },
          {
            id: 'flask-installation',
            title: 'Installing Flask',
            type: 'video',
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fflask-installation.mp4?alt=media',
            description: 'This video demonstrates how to install Flask and set up a virtual environment for your Python web development projects.'
          },
          {
            id: 'hello-world-flask',
            title: 'Your First Flask Application',
            type: 'code',
            language: 'python',
            code: 'from flask import Flask\n\n# Create a Flask application instance\napp = Flask(__name__)\n\n# Define a route and a view function\n@app.route(\'/\')\ndef hello_world():\n    return \'Hello, World! Welcome to Flask.\'\n\n# Add another route\n@app.route(\'/about\')\ndef about():\n    return \'This is a simple Flask application.\'\n\n# Run the application\nif __name__ == \'__main__\':\n    app.run(debug=True)'
          }
        ],
        exercises: [
          {
            id: 'create-routes',
            title: 'Creating Routes in Flask',
            description: 'Practice creating different routes in a Flask application.',
            instructions: 'Complete the Flask application by adding routes for "/users/<username>" that displays a personalized greeting and "/multiply/<num1>/<num2>" that returns the product of the two numbers.',
            starterCode: 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route(\'/\')\ndef index():\n    return \'Welcome to my Flask app!\'\n\n# Add your routes here\n\n\nif __name__ == \'__main__\':\n    app.run(debug=True)',
            solution: 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route(\'/\')\ndef index():\n    return \'Welcome to my Flask app!\'\n\n@app.route(\'/users/<username>\')\ndef greet_user(username):\n    return f\'Hello, {username}! Welcome to my Flask app.\'\n\n@app.route(\'/multiply/<int:num1>/<int:num2>\')\ndef multiply(num1, num2):\n    result = num1 * num2\n    return f\'The product of {num1} and {num2} is {result}.\'\n\nif __name__ == \'__main__\':\n    app.run(debug=True)',
            hint: 'Use dynamic URL routes with the format @app.route(\'/path/<variable>\'). To specify a variable type, use @app.route(\'/path/<type:variable>\') where type can be string, int, float, etc.',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'deep-learning-fundamentals',
    title: 'Deep Learning Fundamentals',
    description: 'Explore the foundations of deep learning, neural networks, and their applications. Build and train neural networks with Python and TensorFlow.',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/courses%2Fdeep-learning.jpg?alt=media',
    category: 'ai',
    level: 'advanced',
    duration: '20 hours',
    isPremium: true,
    learningPoints: [
      'Understand neural network architecture and components',
      'Build and train neural networks with TensorFlow and Keras',
      'Implement convolutional neural networks for image processing',
      'Create recurrent neural networks for sequence data',
      'Apply deep learning to real-world problems'
    ],
    requirements: [
      'Intermediate Python programming skills',
      'Basic understanding of machine learning concepts',
      'Knowledge of linear algebra and calculus',
      'A computer with GPU support recommended'
    ],
    instructor: {
      name: 'Dr. James Wilson',
      title: 'AI Researcher & Deep Learning Expert',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/instructors%2Fjames-wilson.jpg?alt=media',
      bio: 'Dr. Wilson has conducted research in deep learning for over a decade and has published numerous papers on neural networks and their applications. He currently leads an AI research team and consults for tech companies.'
    },
    lessons: [
      {
        id: 'neural-networks-intro',
        title: 'Introduction to Neural Networks',
        duration: '70 min',
        content: [
          {
            id: 'what-are-neural-networks',
            title: 'What are Neural Networks?',
            type: 'text',
            description: 'Neural networks are computational models inspired by the human brain. They consist of interconnected nodes (neurons) organized in layers. Each connection has a weight that adjusts during learning. Neural networks are powerful function approximators that can learn complex patterns from data.'
          },
          {
            id: 'neural-network-architecture',
            title: 'Neural Network Architecture',
            type: 'video',
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pyai-app.appspot.com/o/videos%2Fneural-network-architecture.mp4?alt=media',
            description: 'This video explains the architecture of neural networks, including input layers, hidden layers, output layers, activation functions, and how information flows through the network.'
          },
          {
            id: 'simple-neural-network',
            title: 'Building a Simple Neural Network',
            type: 'code',
            language: 'python',
            code: 'import numpy as np\n\n# A simple neural network with one hidden layer\nclass SimpleNeuralNetwork:\n    def __init__(self, input_size, hidden_size, output_size):\n        # Initialize weights and biases\n        self.W1 = np.random.randn(input_size, hidden_size) * 0.01\n        self.b1 = np.zeros((1, hidden_size))\n        self.W2 = np.random.randn(hidden_size, output_size) * 0.01\n        self.b2 = np.zeros((1, output_size))\n    \n    def sigmoid(self, x):\n        return 1 / (1 + np.exp(-x))\n    \n    def sigmoid_derivative(self, x):\n        return x * (1 - x)\n    \n    def forward(self, X):\n        # Forward propagation\n        self.z1 = np.dot(X, self.W1) + self.b1\n        self.a1 = self.sigmoid(self.z1)\n        self.z2 = np.dot(self.a1, self.W2) + self.b2\n        self.a2 = self.sigmoid(self.z2)\n        return self.a2\n    \n    def backward(self, X, y, output, learning_rate):\n        # Backpropagation\n        self.error = y - output\n        self.delta_output = self.error * self.sigmoid_derivative(output)\n        \n        self.error_hidden = self.delta_output.dot(self.W2.T)\n        self.delta_hidden = self.error_hidden * self.sigmoid_derivative(self.a1)\n        \n        # Update weights and biases\n        self.W2 += self.a1.T.dot(self.delta_output) * learning_rate\n        self.b2 += np.sum(self.delta_output, axis=0, keepdims=True) * learning_rate\n        self.W1 += X.T.dot(self.delta_hidden) * learning_rate\n        self.b1 += np.sum(self.delta_hidden, axis=0, keepdims=True) * learning_rate\n    \n    def train(self, X, y, epochs, learning_rate):\n        for epoch in range(epochs):\n            output = self.forward(X)\n            self.backward(X, y, output, learning_rate)\n            \n            if epoch % 1000 == 0:\n                loss = np.mean(np.square(y - output))\n                print(f\'Epoch {epoch}, Loss: {loss}\')\n        \n        return output\n\n# Example usage\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\ny = np.array([[0], [1], [1], [0]])  # XOR function\n\nnn = SimpleNeuralNetwork(2, 4, 1)\noutput = nn.train(X, y, 10000, 0.1)\n\nprint("Final predictions:")\nfor i in range(len(X)):\n    print(f"Input: {X[i]}, Predicted: {output[i][0]:.4f}, Actual: {y[i][0]}")'
          }
        ],
        exercises: [
          {
            id: 'feedforward-nn',
            title: 'Implementing a Feedforward Neural Network',
            description: 'Practice implementing a feedforward neural network for a simple classification task.',
            instructions: 'Complete the feedforward step of the neural network. The code for the neural network class is provided, but the forward() method is incomplete. Implement the missing code to perform the feedforward computation.',
            starterCode: 'import numpy as np\n\nclass NeuralNetwork:\n    def __init__(self, input_size, hidden_size, output_size):\n        self.W1 = np.random.randn(input_size, hidden_size) * 0.01\n        self.b1 = np.zeros((1, hidden_size))\n        self.W2 = np.random.randn(hidden_size, output_size) * 0.01\n        self.b2 = np.zeros((1, output_size))\n    \n    def sigmoid(self, x):\n        return 1 / (1 + np.exp(-x))\n    \n    def forward(self, X):\n        # TODO: Implement the feedforward computation\n        # 1. Compute the first layer output (z1 = X * W1 + b1)\n        # 2. Apply sigmoid activation to get activations a1\n        # 3. Compute the second layer output (z2 = a1 * W2 + b2)\n        # 4. Apply sigmoid activation to get final output a2\n        # 5. Return the final output\n        pass\n\n# Test the implementation\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\nnn = NeuralNetwork(2, 3, 1)\noutput = nn.forward(X)\nprint("Output shape should be (4, 1):", output.shape)\nprint("Outputs should be between 0 and 1:\\n", output)',
            solution: 'import numpy as np\n\nclass NeuralNetwork:\n    def __init__(self, input_size, hidden_size, output_size):\n        self.W1 = np.random.randn(input_size, hidden_size) * 0.01\n        self.b1 = np.zeros((1, hidden_size))\n        self.W2 = np.random.randn(hidden_size, output_size) * 0.01\n        self.b2 = np.zeros((1, output_size))\n    \n    def sigmoid(self, x):\n        return 1 / (1 + np.exp(-x))\n    \n    def forward(self, X):\n        # 1. Compute the first layer output\n        z1 = np.dot(X, self.W1) + self.b1\n        \n        # 2. Apply sigmoid activation\n        a1 = self.sigmoid(z1)\n        \n        # 3. Compute the second layer output\n        z2 = np.dot(a1, self.W2) + self.b2\n        \n        # 4. Apply sigmoid activation for final output\n        a2 = self.sigmoid(z2)\n        \n        # 5. Return the final output\n        return a2',
            hint: 'For each layer, you need to calculate z = X * W + b (matrix multiplication) and then apply the activation function a = sigmoid(z). For the first layer, X is the input data. For the second layer, the input is the activations from the first layer.',
            completed: false
          }
        ]
      }
    ]
  }
];

export default courses;