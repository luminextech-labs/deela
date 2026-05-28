package com.deela.app.ui.navigation

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.deela.app.ui.screens.*
import com.deela.app.ui.theme.*

sealed class Screen(val route: String, val label: String, val emoji: String) {
    object Home : Screen("home", "Home", "🏠")
    object Search : Screen("search", "Search", "🔍")
    object Alerts : Screen("alerts", "Alerts", "🔔")
    object Profile : Screen("profile", "Profile", "👤")
    object Product : Screen("product/{id}", "Product", "📦") {
        fun createRoute(id: String) = "product/$id"
    }
}

val bottomNavItems = listOf(Screen.Home, Screen.Search, Screen.Alerts, Screen.Profile)

@Composable
fun DeelaNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    Scaffold(
        bottomBar = {
            if (currentRoute in bottomNavItems.map { it.route }) {
                DeelaBottomNav(
                    currentRoute = currentRoute,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues = padding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onCategoryClick = { navController.navigate(Screen.Search.route) },
                    onDealClick = { id -> navController.navigate(Screen.Product.createRoute(id)) },
                    onSearchClick = { navController.navigate(Screen.Search.route) }
                )
            }
            composable(Screen.Search.route) {
                SearchScreen(
                    onBackClick = { navController.popBackStack() },
                    onProductClick = { id -> navController.navigate(Screen.Product.createRoute(id)) }
                )
            }
            composable(Screen.Alerts.route) {
                AlertScreen()
            }
            composable(Screen.Profile.route) {
                ProfileScreen()
            }
            composable(Screen.Product.route) { backStackEntry ->
                val productId = backStackEntry.arguments?.getString("id") ?: "1"
                ProductScreen(
                    productId = productId,
                    onBackClick = { navController.popBackStack() },
                    onShopeeClick = {}
                )
            }
        }
    }
}

@Composable
fun DeelaBottomNav(currentRoute: String?, onNavigate: (String) -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shadowElevation = 8.dp,
        color = Color.White
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            bottomNavItems.forEach { screen ->
                val isActive = currentRoute == screen.route
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable { onNavigate(screen.route) }
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Text(text = screen.emoji, fontSize = 20.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = screen.label,
                        fontSize = 10.sp,
                        fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Medium,
                        color = if (isActive) Purple else TextGray
                    )
                }
            }
        }
    }
}