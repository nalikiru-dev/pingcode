export const sampleProjects = [
  {
    id: 'js-starter',
    name: 'JavaScript Starter',
    description: 'A simple JavaScript project with HTML and CSS',
    language: 'javascript',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        path: '/',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Starter</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello, PingCode!</h1>
    <p>Edit this file to get started with your project.</p>
    <button id="clickMe">Click Me</button>
    <p id="result"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'style-css',
        name: 'style.css',
        path: '/',
        language: 'css',
        content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #2980b9;
}

#result {
  margin-top: 1rem;
  font-weight: bold;
}`
      },
      {
        id: 'script-js',
        name: 'script.js',
        path: '/',
        language: 'javascript',
        content: `// Get DOM elements
const button = document.getElementById('clickMe');
const result = document.getElementById('result');

// Counter to track number of clicks
let clickCount = 0;

// Event listener for button click
button.addEventListener('click', () => {
  clickCount++;
  result.textContent = \`You clicked the button \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
  
  // Change color based on number of clicks
  if (clickCount >= 10) {
    result.style.color = '#e74c3c';
  } else if (clickCount >= 5) {
    result.style.color = '#f39c12';
  } else {
    result.style.color = '#2ecc71';
  }
});

// Log to console
console.log('Script loaded successfully!');`
      }
    ]
  },
  {
    id: 'py-starter',
    name: 'Python Starter',
    description: 'A simple Python project with example code',
    language: 'python',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    files: [
      {
        id: 'main-py',
        name: 'main.py',
        path: '/',
        language: 'python',
        content: `# Simple Python starter project

def greet(name):
    """
    Simple greeting function
    
    Args:
        name (str): Name to greet
        
    Returns:
        str: Greeting message
    """
    return f"Hello, {name}! Welcome to PingCode."

def calculate_factorial(n):
    """
    Calculate factorial of n
    
    Args:
        n (int): Number to calculate factorial for
        
    Returns:
        int: Factorial of n
    """
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n - 1)

# Main program
if __name__ == "__main__":
    user_name = input("Enter your name: ")
    print(greet(user_name))
    
    try:
        num = int(input("Enter a number to calculate factorial: "))
        result = calculate_factorial(num)
        print(f"The factorial of {num} is {result}")
    except ValueError:
        print("Please enter a valid number")
    except RecursionError:
        print("Number too large for recursion")`
      },
      {
        id: 'utils-py',
        name: 'utils.py',
        path: '/',
        language: 'python',
        content: `# Utility functions

def is_prime(n):
    """
    Check if a number is prime
    
    Args:
        n (int): Number to check
        
    Returns:
        bool: True if prime, False otherwise
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    
    return True

def fibonacci(n):
    """
    Generate the first n Fibonacci numbers
    
    Args:
        n (int): Number of Fibonacci numbers to generate
        
    Returns:
        list: List of Fibonacci numbers
    """
    fib_sequence = [0, 1]
    
    if n <= 0:
        return []
    if n == 1:
        return [0]
    if n == 2:
        return fib_sequence
    
    for i in range(2, n):
        fib_sequence.append(fib_sequence[i-1] + fib_sequence[i-2])
    
    return fib_sequence`
      }
    ]
  },
  {
    id: 'rust-starter',
    name: 'Rust Starter',
    description: 'A simple Rust project with basic examples',
    language: 'rust',
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
    files: [
      {
        id: 'main-rs',
        name: 'main.rs',
        path: '/',
        language: 'rust',
        content: `// Simple Rust starter project

fn main() {
    println!("Hello, PingCode!");
    
    // Variable declaration
    let name = "Rust Developer";
    let age = 30;
    
    // Using variables
    println!("Name: {}, Age: {}", name, age);
    
    // Calling functions
    let result = add(5, 7);
    println!("5 + 7 = {}", result);
    
    // Conditional statements
    if result > 10 {
        println!("Result is greater than 10");
    } else {
        println!("Result is 10 or less");
    }
    
    // Loop
    for i in 1..=5 {
        println!("Loop iteration: {}", i);
    }
    
    // Vector
    let mut numbers = vec![1, 2, 3, 4, 5];
    numbers.push(6);
    
    println!("Numbers: {:?}", numbers);
    
    // Using the greeting function
    let greeting = create_greeting("Rust Developer");
    println!("{}", greeting);
}

// Simple function to add two numbers
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Function that returns a string
fn create_greeting(name: &str) -> String {
    format!("Welcome to Rust programming, {}!", name)
}`
      },
      {
        id: 'lib-rs',
        name: 'lib.rs',
        path: '/',
        language: 'rust',
        content: `// Library functions for Rust starter project

/// Calculate the factorial of a number
pub fn factorial(n: u64) -> u64 {
    if n == 0 || n == 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

/// Check if a number is prime
pub fn is_prime(n: u64) -> bool {
    if n <= 1 {
        return false;
    }
    if n <= 3 {
        return true;
    }
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }
    
    let mut i = 5;
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    
    true
}

/// Generate a Fibonacci sequence of length n
pub fn fibonacci(n: usize) -> Vec<u64> {
    if n == 0 {
        return Vec::new();
    }
    if n == 1 {
        return vec![0];
    }
    
    let mut sequence = vec![0, 1];
    for i in 2..n {
        let next = sequence[i-1] + sequence[i-2];
        sequence.push(next);
    }
    
    sequence
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_factorial() {
        assert_eq!(factorial(0), 1);
        assert_eq!(factorial(1), 1);
        assert_eq!(factorial(5), 120);
    }
    
    #[test]
    fn test_is_prime() {
        assert!(!is_prime(1));
        assert!(is_prime(2));
        assert!(is_prime(17));
        assert!(!is_prime(20));
    }
    
    #[test]
    fn test_fibonacci() {
        assert_eq!(fibonacci(0), Vec::<u64>::new());
        assert_eq!(fibonacci(1), vec![0]);
        assert_eq!(fibonacci(5), vec![0, 1, 1, 2, 3]);
    }
}`
      }
    ]
  }
];